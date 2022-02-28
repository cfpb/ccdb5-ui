/// <reference types="cypress" />

describe( 'Search Bar', () => {
  beforeEach( () => {
    let request = '?**&size=0';
    let fixture = { fixture: 'common/get-aggs.json' };
    cy.intercept( 'GET', request, fixture ).as( 'getAggs' );

    request = '?**&sort=created_date_desc';
    fixture = { fixture: 'common/get-complaints.json' };
    cy.intercept( request, fixture ).as( 'getComplaints' );

    request = '**/ccdb/metadata.js';
    fixture = { fixture: 'metadata.js' };
    cy.intercept( request, fixture ).as( 'metadata' );

    const typeAheadRequest = '**/data-research/consumer-complaints/search/' +
        'api/v1/_suggest_company/**';
    cy.intercept( typeAheadRequest, {} ).as( 'typeahead' )
    cy.visit( '?tab=List' );
    cy.wait( '@metadata' );
    cy.wait( '@getAggs' );
    cy.wait( '@getComplaints' );
  } );

  it( 'has a search bar', () => {
    cy.get( '.search-bar' )
      .should( 'be.visible' );

    cy.get( '#searchField' ).select( 'company' );
    cy.wait( '@getComplaints' );

    cy.get( '#searchField' ).select( 'complaint_what_happened' );
    cy.wait( '@getComplaints' );
  } );

  describe( 'Typeaheads', () => {

    it( 'has no typeahead functionality in All Data', () => {
      cy.get( '#searchText' ).clear()
          .wait( 400 )
          .type( 'bank', { delay: 200 } );
      cy.get( '@typeahead.all' )
          .should( 'have.length', 0 );
    } );

    it( 'has no typeahead functionality in Narratives', () => {
      cy.get( '#searchField' ).select( 'complaint_what_happened' );
      cy.wait( '@getComplaints' );

      cy.get( '#searchText' ).clear()
          .wait( 400 )
          .type( 'bank', { delay: 200 } );
      cy.get( '@typeahead.all' )
          .should( 'have.length', 0 );
    } );

    it( 'has typeahead functionality in Comp  any', () => {
      cy.get( '#searchField' ).select( 'company' );
      cy.wait( '@getComplaints' );

      cy.get( '#searchText' ).clear()
          .wait( 400 )
          .type( 'bank', { delay: 200 } );

      cy.wait( '@typeahead' )
          .wait( '@typeahead' )
          .wait( '@typeahead' );

      cy.get( '@typeahead.all' )
          .should( 'have.length', 3 );
    } );
  } );

} );
