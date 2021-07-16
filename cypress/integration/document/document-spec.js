/// <reference types="cypress" />

describe( 'Document View', () => {
  describe( 'error handling', () => {
    it( 'handles bogus id', () => {
      cy.visit( Cypress.env( 'HOST' ) + '/detail/ThisIsNotAValidId' )
      cy.get( 'h1' )
        .contains( 'There was a problem retrieving ThisIsNotAValidId' )
        .should( 'be.visible' )
    } )
  } )

  describe( 'document detail view', () => {
    beforeEach( () => {
      cy.intercept( 'GET', '**/api/v1/?**&size=0' )
          .as( 'getAggs' );
      cy.intercept( 'GET', '**/api/v1/?**&sort=created_date_desc' )
          .as( 'getComplaints' );

      cy.visit( Cypress.env( 'HOST' ) + '?tab=List' )

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
      cy.intercept( 'GET', '**/api/v1/?**&field=all&has_narrative=true&search_term=pizza&size=10&sort=relevance_desc' )
        .as( 'getResults' )

      cy.visit( Cypress.env( 'HOST' ) +
        '?searchText=pizza&has_narrative=true&size=10&sort=relevance_desc&tab=List' )

      cy.wait( '@getResults' )

      cy.get( '#choose-sort' )
        .should( 'have.value', 'relevance_desc' )

      cy.contains( '.pill', 'Has narrative' )
        .should( 'be.visible' )

      cy.get( '#filterHasNarrative' )
        .should( 'be.checked' )

      cy.get( '.cards-panel .card-container a' )
        .first()
        .click()

      cy.url()
        .should( 'contain', '/detail' )

      cy.get( '.back-to-search button' )
        .contains( 'Back to search results' )
        .click()

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
