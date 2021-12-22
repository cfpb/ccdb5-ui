/// <reference types="cypress" />

describe( 'Document View', () => {
  describe( 'error handling', () => {
    it( 'handles bogus id', () => {
      cy.visit( '/detail/ThisIsNotAValidId' )
      cy.get( 'h1' )
        .contains( 'There was a problem retrieving ThisIsNotAValidId' )
        .should( 'be.visible' )
    } )
  } )

  describe( 'document detail view', () => {
    beforeEach( () => {
      let request = '?**&sort=created_date_desc';
      let fixture = { fixture: 'document/get-complaints.json' };
      cy.intercept( request, fixture ).as( 'getComplaints' );

      request = '?**&size=0';
      fixture = { fixture: 'document/get-aggs.json' };
      cy.intercept( 'GET', request, fixture ).as( 'getAggs' );

      cy.visit( '?tab=List' )

      cy.wait( '@getAggs' );
      cy.wait( '@getComplaints' );
    } )
    it( 'navigates to document detail', () => {
      cy.get( '.cards-panel .card-container a' )
        .first()
        .click()

      cy.url()
        .should( 'contain', '/detail' )

      cy.log( 'go back to search' )
      cy.get( '.back-to-search button' )
        .contains( 'Back to search results' )
        .click()

      cy.url()
        .should( 'not.contain', '/detail' )
    } )
  } )

  describe( 'preserve page state', () => {
    it( 'restores filters after visiting document detail', () => {
      let request = '?**&search_term=pizza**&size=0';
      let fixture = { fixture: 'document/get-aggs-results.json' };
      cy.intercept( request, fixture ).as( 'getAggsResults' );

      request = '/?**&field=all&has_narrative=true&search_term=pizza&size=10&sort=relevance_desc';
      fixture = { fixture: 'document/get-results.json' };
      cy.intercept( request, fixture ).as( 'getResults' );

      request = '/3146099';
      fixture = { fixture: 'document/get-detail.json' };
      cy.intercept( request, fixture ).as( 'getDetail' );

      cy.intercept( 'GET', '/_suggest/?text=pizza', [] );

      cy.visit(
        '?searchText=pizza&has_narrative=true&size=10&sort=relevance_desc&tab=List'
      )

      cy.get( '#choose-sort' )
        .should( 'have.value', 'relevance_desc' )

      cy.contains( '.pill', 'Has narrative' )
        .should( 'be.visible' )

      cy.get( '#filterHasNarrative' )
        .should( 'be.checked' )

      cy.get( '.cards-panel .card-container a' )
        .first()
        .click()

      cy.wait( '@getDetail' )

      cy.url()
        .should( 'contain', '/detail' )

      cy.get( '.back-to-search button' )
        .contains( 'Back to search results' )
        .click()

      cy.wait( '@getAggsResults' )
      cy.wait( '@getResults' )

      cy.get( '#choose-sort' )
        .should( 'have.value', 'relevance_desc' )

      cy.contains( '.pill', 'Has narrative' )
        .should( 'be.visible' )

      cy.get( '#filterHasNarrative' )
        .should( 'be.checked' )

    } )
  } )
} )
