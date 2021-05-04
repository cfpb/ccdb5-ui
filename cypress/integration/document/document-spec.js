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
      cy.visit( Cypress.env( 'HOST' ) + '?tab=List' )
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

    it( 'preserves selected filters', () => {
      // copied from list-spec
    } )
  } )

  describe( 'preserve page state', () => {
    it( 'restores filters after visiting document detail', () => {
      cy.intercept( 'GET', 'api/v1**no_aggs=true' )
        .as( 'getResults' )
      cy.visit( Cypress.env( 'HOST' ) +
        '?has_narrative=true&sort=relevance_desc&tab=List' )

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

      cy.get( '#choose-sort' )
        .should( 'have.value', 'relevance_desc' )

      cy.contains( '.pill', 'Has narrative' )
        .should( 'be.visible' )

      cy.get( '#filterHasNarrative' )
        .should( 'be.checked' )

    } )
  } )
} )
