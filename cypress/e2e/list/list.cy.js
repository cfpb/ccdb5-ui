import { waitForLoading } from '../utils';

describe('List View', () => {
  const cardContainers = '.cards-panel .card-container';
  const currentPage = '.m-pagination__label';
  const nextButton = '.m-pagination .m-pagination__btn-next';
  const prevButton = '.m-pagination .m-pagination__btn-prev';
  const addNarrativesButton = '#btn-add-narratives';
  const removeNarrativesButton = '#btn-remove-narratives';
  const filterHasNarrative = '#filterHasNarrative';

  it('shows complaints, pagination, sorts and filters', () => {
    cy.visit('?size=10&searchText=debt%20recovery&tab=List');
    waitForLoading();
    cy.get('.cards-panel').should('be.visible');
    cy.get(cardContainers).should('have.length', 10);
    cy.url().should('contain', 'size=10');
    cy.get(nextButton).click();

    waitForLoading();
    cy.url().should('contain', 'page=2');

    cy.log('reset the pager after sort');
    cy.get('#select-size').select('25 results');
    cy.get('#select-size').select('10 results');

    waitForLoading();

    cy.get(cardContainers).should('have.length', 10);
    cy.url().should('contain', 'size=10');
    cy.url().should('contain', 'page=1');
    cy.log('changes the sort order');
    cy.url().should('contain', 'sort=created_date_desc');
    cy.get(nextButton).click();
    waitForLoading();

    cy.url().should('contain', 'page=2');

    cy.get('#select-sort').select('relevance_desc');
    waitForLoading();
    cy.url().should('contain', 'sort=relevance_desc');
    cy.url().should('contain', 'page=1');

    cy.log('should filter the results to narrative-only results and back');
    // Initially all is checked.
    cy.get(removeNarrativesButton).should('have.class', 'selected');
    cy.get(filterHasNarrative).should('not.be.checked');

    // Click the narrative-only button.
    cy.get(addNarrativesButton).click();
    cy.get(addNarrativesButton).should('have.class', 'selected');

    cy.get(filterHasNarrative).should('be.checked');

    // Click the narrative-only button again. There should be no change.
    cy.get(addNarrativesButton).click({ force: true });
    cy.get(addNarrativesButton).should('have.class', 'selected');

    cy.get(filterHasNarrative).should('be.checked');

    // Click the all results button. The narratives should be removed.
    cy.get(removeNarrativesButton).click();
    cy.get(removeNarrativesButton).should('have.class', 'selected');

    cy.get(filterHasNarrative).should('not.be.checked');

    cy.log('tests pagination');
    cy.log('it exists');
    cy.get('.m-pagination').should('be.visible');

    cy.log('has a disabled prev button');
    cy.get(prevButton).should('be.disabled');
    cy.get(nextButton).should('not.be.disabled');

    cy.log('goes to the next page');
    cy.get(nextButton).click();
    cy.url().should('include', 'page=2');
    cy.get(cardContainers).should('have.length', 10);
    cy.get(prevButton)
      .should('be.visible')
      .should('not.have.class', 'a-btn__disabled');
    cy.get(currentPage).should('have.text', 'Page 2');

    cy.log('resets after applying filter');
    waitForLoading();
    cy.get('.aggregation-branch label.a-label:first').click();
    cy.get(currentPage).should('have.text', 'Page 1');

    cy.log('pagination resets after applying date filter');
    cy.get(nextButton).click();
    cy.get(currentPage).should('have.text', 'Page 2');
    cy.get('#date_received-from').clear();
    cy.get('#date_received-from').type('2018-09-23');
    cy.get('#date_received-from').blur();
    cy.get(currentPage).should('have.text', 'Page 1');

    cy.log('resets after select fields');
    const fields = ['Company name', 'Narratives', 'All data'];
    cy.log('it exists');
    cy.get('.m-pagination').should('be.visible');
    cy.get(nextButton).click();
    cy.get(currentPage).should('have.text', 'Page 2');

    fields.forEach((field) => {
      cy.log(`reset paging when search field changes to ${field}`);
      cy.get('#searchField')
        .should('be.visible')
        .select(field, { force: true });
      cy.get(currentPage).should('have.text', 'Page 1');
    });
  });
});
