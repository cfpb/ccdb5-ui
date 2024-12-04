/// <reference types="cypress" />

const ccdbApiUrl = '/data-research/consumer-complaints/search/api/v1/';

describe('Document View', () => {
  describe('error handling', () => {
    it('handles bogus id', () => {
      cy.visit('/detail/ThisIsNotAValidId');
      cy.findByRole('heading', {
        name: 'There was a problem retrieving ThisIsNotAValidId',
      }).should('be.visible');
    });
  });

  describe('document detail view', () => {
    beforeEach(() => {
      let request = '?**&sort=created_date_desc';
      let fixture = { fixture: 'document/get-complaints.json' };
      cy.intercept(request, fixture).as('getComplaints');

      request = '?**&size=0';
      fixture = { fixture: 'document/get-aggs.json' };
      cy.intercept('GET', request, fixture).as('getAggs');

      cy.visit('?tab=List');

      cy.wait('@getAggs');
      cy.wait('@getComplaints');
    });
    it('navigates to document detail', () => {
      cy.get('.cards-panel .card-container a').first().click();

      cy.url().should('contain', '/detail');

      cy.log('go back to search');
      cy.get('.back-to-search a').contains('Back to search results').click();

      cy.url().should('not.contain', '/detail');
    });
  });

  describe('preserve page state', () => {
    it('restores filters after visiting document detail', () => {
      let request = '?**&search_term=pizza**&size=0';
      let fixture = { fixture: 'document/get-aggs-results.json' };
      cy.intercept(request, fixture).as('getAggsResults');

      request =
        '?**&field=all&frm=0&has_narrative=true&no_aggs=true**&search_term=pizza&size=10&sort=relevance_desc';
      fixture = { fixture: 'document/get-results.json' };
      cy.intercept(request, fixture).as('getResults');

      cy.intercept('GET', '/_suggest/?text=pizza', []);

      cy.visit(
        '?searchText=pizza&has_narrative=true&size=10&sort=relevance_desc&tab=List',
      );

      cy.get('select#select-sort option:selected').should(
        'have.text',
        'Relevance',
      );

      cy.contains('.pill', 'Has narrative').should('be.visible');

      cy.get('#filterHasNarrative').should('be.checked');

      request = `${ccdbApiUrl}3146099`;
      fixture = { fixture: 'document/get-detail.json' };
      cy.intercept(request, fixture).as('getDetail');

      cy.get('.cards-panel .card-container a').first().click();

      cy.wait('@getDetail');

      cy.url().should('contain', '/detail');

      cy.get('.back-to-search a').contains('Back to search results').click();

      cy.wait('@getAggsResults');
      cy.wait('@getResults');

      cy.get('select#select-sort option:selected').should(
        'have.text',
        'Relevance',
      );

      cy.contains('.pill', 'Has narrative').should('be.visible');

      cy.get('#filterHasNarrative').should('be.checked');
    });
  });
});
