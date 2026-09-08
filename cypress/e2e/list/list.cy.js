import { waitForLoading } from '../utils';

const complaintLinks = () => cy.findAllByRole('link', { name: /^Complaint / });

const pagination = () => cy.findByRole('navigation', { name: 'Pagination' });

const sizeSelect = () => cy.findByLabelText('Show per page');

const sortSelect = () => cy.findByLabelText('Sort by');

const searchField = () =>
  cy.findByLabelText('Choose which field will be searched');

describe('List View', () => {
  it('shows complaints, pagination, sorts and filters', () => {
    cy.visit('?size=10&searchText=debt%20recovery');
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

    cy.log('tests pagination');
    cy.log('it exists');
    pagination().should('be.visible');

    cy.log('has a disabled prev button');
    pagination()
      .findByRole('button', { name: 'Previous' })
      .should('be.disabled');
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
      name: 'Collapse Product and sub-product filter',
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
    cy.get('#date-received-from').clear();
    cy.get('#date-received-from').type('2018-09-23');
    cy.get('#date-received-from').blur();
    pagination().findByText('Page 1').should('exist');

    cy.log('resets after select fields');
    const fields = ['Company name', 'All data'];
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
