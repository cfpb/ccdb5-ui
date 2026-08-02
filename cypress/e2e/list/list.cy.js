import { waitForLoading } from '../utils';

const complaintLinks = () => cy.findAllByRole('link', { name: /^Complaint / });

const pagination = () => cy.findByRole('navigation', { name: 'Pagination' });

const sizeSelect = () =>
  cy.findByLabelText('Select the number of results to display at a time');

const sortSelect = () =>
  cy.findByLabelText('Choose the order in which the results are displayed');

const searchField = () =>
  cy.findByLabelText('Choose which field will be searched');

const narrativesOnlyButton = () =>
  cy.findByRole('button', { name: 'Only complaints with narratives' });

const allComplaintsButton = () =>
  cy.findByRole('button', { name: 'All complaints' });

const hasNarrativeCheckbox = () =>
  cy
    .findByRole('heading', {
      name: 'Only show complaints with narratives?',
    })
    .closest('section')
    .findByRole('checkbox', { name: 'Yes' });

describe('List View', () => {
  it('shows complaints, pagination, sorts and filters', () => {
    cy.visit('?size=10&searchText=debt%20recovery&tab=List');
    waitForLoading();
    complaintLinks().should('have.length', 10);
    cy.url().should('contain', 'size=10');
    pagination().findByRole('button', { name: 'Next' }).click();

    waitForLoading();
    cy.url().should('contain', 'page=2');

    cy.log('reset the pager after sort');
    sizeSelect().select('25 results');
    sizeSelect().select('10 results');

    waitForLoading();

    complaintLinks().should('have.length', 10);
    cy.url().should('contain', 'size=10');
    cy.url().should('contain', 'page=1');
    cy.log('changes the sort order');
    cy.url().should('contain', 'sort=created_date_desc');
    pagination().findByRole('button', { name: 'Next' }).click();
    waitForLoading();

    cy.url().should('contain', 'page=2');

    sortSelect().select('relevance_desc');
    waitForLoading();
    cy.url().should('contain', 'sort=relevance_desc');
    cy.url().should('contain', 'page=1');

    cy.log('should filter the results to narrative-only results and back');
    // Initially all is checked.
    allComplaintsButton().should('have.class', 'selected');
    hasNarrativeCheckbox().should('not.be.checked');

    // Click the narrative-only button.
    narrativesOnlyButton().click();
    narrativesOnlyButton().should('have.class', 'selected');

    hasNarrativeCheckbox().should('be.checked');

    // Click the narrative-only button again. There should be no change.
    narrativesOnlyButton().click({ force: true });
    narrativesOnlyButton().should('have.class', 'selected');

    hasNarrativeCheckbox().should('be.checked');

    // Click the all results button. The narratives should be removed.
    allComplaintsButton().click();
    allComplaintsButton().should('have.class', 'selected');

    hasNarrativeCheckbox().should('not.be.checked');

    cy.log('tests pagination');
    cy.log('it exists');
    pagination().should('be.visible');

    cy.log('has a disabled prev button');
    pagination().findByRole('button', { name: 'Previous' }).should('be.disabled');
    pagination()
      .findByRole('button', { name: 'Next' })
      .should('not.be.disabled');

    cy.log('goes to the next page');
    pagination().findByRole('button', { name: 'Next' }).click();
    cy.url().should('include', 'page=2');
    complaintLinks().should('have.length', 10);
    pagination()
      .findByRole('button', { name: 'Previous' })
      .should('be.visible')
      .should('not.be.disabled');
    pagination().findByText('Page 2').should('exist');

    cy.log('resets after applying filter');
    waitForLoading();
    cy.findByRole('button', {
      name: 'Collapse Product / sub-product filter',
    })
      .closest('section')
      .within(() => {
        cy.findAllByRole('checkbox').first().click({ force: true });
      });
    pagination().findByText('Page 1').should('exist');

    cy.log('pagination resets after applying date filter');
    pagination().findByRole('button', { name: 'Next' }).click();
    pagination().findByText('Page 2').should('exist');
    // id is the label association target; two "From" fields exist on the page
    cy.get('#date_received-from').clear();
    cy.get('#date_received-from').type('2018-09-23');
    cy.get('#date_received-from').blur();
    pagination().findByText('Page 1').should('exist');

    cy.log('resets after select fields');
    const fields = ['Company name', 'Narratives', 'All data'];
    cy.log('it exists');
    pagination().should('be.visible');
    pagination().findByRole('button', { name: 'Next' }).click();
    pagination().findByText('Page 2').should('exist');

    for (const field of fields) {
      cy.log(`reset paging when search field changes to ${field}`);
      searchField().should('be.visible').select(field, { force: true });
      pagination().findByText('Page 1').should('exist');
    }
  });
});
