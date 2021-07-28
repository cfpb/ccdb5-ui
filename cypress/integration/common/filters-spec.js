/// <reference types="cypress" />

import moment from 'moment';

describe( 'Filter Panel', () => {
  beforeEach( () => {

    cy.intercept( 'GET', '**/api/v1/?**&size=0' )
      .as( 'getAggs' );
    cy.intercept( 'GET', '**/api/v1/?**&sort=created_date_desc' )
      .as( 'getComplaints' );
    cy.visit( Cypress.env( 'HOST' ) + '?tab=List' );
    cy.wait( '@getAggs' );
    cy.wait( '@getComplaints' );
  } );

  it( 'has a filter', () => {
    cy.get( '.filter-panel' )
      .should( 'be.visible' );
  } );

  describe( 'Date Received Filter', () => {
    it( 'has basic functionality', () => {
      cy.log( 'is expanded' )

      cy.get( '#date_received-from' )
        .should( 'be.visible' );

      cy.log( 'collapse it' )
      cy.get( '.date-filter button.a-btn__link:first' )
        .click( { force: true } );

      cy.get( '#date-received-agg #start_date' )
        .should( 'not.exist' );

      cy.log( 'open it' )
      cy.get( '.date-filter button.a-btn__link:first' )
          .click( { force: true } );
      cy.log( 'apply dates' )

      cy.get( '#date_received-from' )
        .clear()
        .type( '09/11/2015' )
        .blur();

      cy.wait( '@getComplaints' );

      cy.url()
        .should( 'include', 'date_received_min=2015-09-11' );

      cy.log( 'apply a through date' )

      cy.get( '#date_received-through' )
        .clear()
        .type( '10/31/2020' )
        .blur();
      cy.url()
        .should( 'include', 'date_received_max=2020-10-31' );
    } );

    it( 'can trigger a pre-selected date range', () => {
      cy.intercept( 'GET', '**/api/v1/geo/states/?**' )
        .as( 'getGeo' );
      cy.get( 'button.map' )
        .click();
      cy.wait( '@getGeo' );

      const maxDate = moment( new Date() ).format( 'YYYY-MM-DD' );
      let minDate = moment( new Date() ).subtract( 3, 'years' ).format( 'YYYY-MM-DD' );
      cy.get( '.date-ranges .a-btn.range-3y' )
        .contains( '3y' )
        .click();
      cy.url()
        .should( 'include', `date_received_max=${ maxDate }&date_received_min=${ minDate }` );
      minDate = moment( new Date() ).subtract( 6, 'months' ).format( 'YYYY-MM-DD' );
      cy.get( '.date-ranges .a-btn.range-6m' )
        .contains( '6m' )
        .click();
      cy.url()
        .should( 'include', `date_received_max=${ maxDate }&date_received_min=${ minDate }` );
    } );
  } );

  describe( 'Simple Filter', () => {
    it( 'can expand a filter group', () => {
      cy.get( '.timely > .o-expandable_header > .o-expandable_header-right > .a-btn' )
        .click();
      cy.get( '.timely > :nth-child(3) > ul > :nth-child(1) > .a-label' )
        .should( 'be.visible' );
    } );

    it( 'can collapse a filter group', () => {
      cy.get( '.timely > .o-expandable_header > .o-expandable_header-right > .a-btn' )
        .click();
      cy.get( '.timely > :nth-child(3) > ul > :nth-child(1) > .a-label' )
        .should( 'be.visible' );
      // Close it after opening it
      cy.get( '.timely > .o-expandable_header > .o-expandable_header-right > .a-btn' )
        .click();
      cy.get( '.timely > :nth-child(3) > ul > :nth-child(1) > .a-label' )
        .should( 'not.exist' );
    } );

    it( 'applies a filter by clicking', () => {
      cy.get( '.timely > .o-expandable_header > .o-expandable_header-right > .a-btn' )
        .click();
      cy.get( '.timely > :nth-child(3) > ul > :nth-child(1) > .a-label' )
        .should( 'be.visible' );

      cy.get( '.timely > :nth-child(3) > ul > :nth-child(1) > .a-label' )
        .click();

      cy.url()
        .should( 'include', 'timely=Yes' );
      // Filter pill
      cy.get( '.pill-panel .pill' )
        .contains( 'Timely: Yes' )
        .should( 'exist' );
      // Filter clear button
      cy.get( 'li.clear-all' )
        .should( 'exist' );
    } );
  } );

  describe( 'Complex Filters', () => {
    // Product/Sub-product
    it( 'can collapse a filter', () => {
      cy.get( '.filter-panel .product .aggregation-branch' )
        .should( 'have.length.gt', 1 )

      // close it
      cy.get( '.filter-panel .product .o-expandable_cue-close' )
        .click();
      cy.get( '.filter-panel .product .aggregation-branch' )
        .should( 'have.length', 0 )

      // open it
      cy.get( '.filter-panel .product .o-expandable_cue-open' )
        .click();

      cy.get( '.filter-panel .product .aggregation-branch' )
        .should( 'have.length.gt', 1 )

    } );

    it( 'can expand sub-filters', () => {
      cy.get( '.filter-panel .product .children' )
        .should( 'not.exist' );
      // Open sub-filter
      cy.get( '.filter-panel .product .aggregation-branch:first .a-btn__link' )
        .click();
      cy.get( '.filter-panel .product .children' )
        .should( 'exist' );
      cy.get( '.filter-panel .product .aggregation-branch:first .a-btn__link' )
        .click();
      cy.get( '.filter-panel .product .children' )
        .should( 'not.exist' );
    } );
    //
    it( 'toggles a filter by clicking checkbox input', () => {
      cy.log( 'add filter' )
      cy.get( 'input#product-mortgage' )
        .click( { force: true } );
      cy.wait( '@getAggs' );
      cy.wait( '@getComplaints' );
      cy.get( '.pill-panel .pill' )
        .contains( 'Mortgage' )
        .should( 'exist' );
      cy.url()
        .should( 'include', 'product=Mortgage' );
      cy.log( 'remove filter' )
      cy.get( 'input#product-mortgage' )
        .click( { force: true } );
      cy.wait( '@getAggs' );
      cy.wait( '@getComplaints' );
      // Filter pill
      cy.get( '.pill-panel .pill' )
        .should( 'not.exist' );
      cy.url()
        .should( 'not.include', 'product=Mortgage' );
    } );

    it( 'applies sub-filter by clicking', () => {
      cy.get( '.filter-panel .product .children' )
        .should( 'not.exist' );
      // Open sub-filter
      cy.get( '.filter-panel .product .aggregation-branch.mortgage button' )
        .click();
      cy.get( '.filter-panel .product .aggregation-branch.mortgage .children' )
        .should( 'exist' );
      cy.get( '.filter-panel .product input#product-mortgage-fha-mortgage' )
        .click( { force: true } );

      cy.url()
        .should( 'include', '&product=Mortgage%E2%80%A2FHA%20mortgage' );

      cy.get( '.pill-panel .pill' )
        .contains( 'FHA mortgage' )
        .should( 'exist' );

      cy.log( 'remove sub-filter when applying parent filter' );
      cy.get( 'input#product-mortgage' )
        .click( { force: true } );
      cy.wait( '@getComplaints' );

      cy.get( '.pill-panel .pill' )
        .contains( 'FHA mortgage' )
        .should( 'not.exist' );

      cy.url()
        .should( 'not.include', '&product=Mortgage%E2%80%A2FHA%20mortgage' );
      cy.url()
        .should( 'include', 'product=Mortgage' );

    } );

    it( 'shows more results', () => {
      cy.get( '.list-panel .card-container' )
        .should( 'have.length', 25 );
      cy.get( '#choose-size' )
        .select( '10 results' )
      cy.wait( '@getComplaints' )
      cy.get( '.list-panel .card-container' )
        .should( 'have.length', 10 );
    } );
  } );

  describe( 'Typeahead Filters', () => {
    // state
    it( 'can collapse a filter', () => {
      cy.get( '.state input' )
        .should( 'be.visible' );

      cy.get( '.state .o-expandable_link' )
        .click();

      cy.get( '.state input' )
        .should( 'not.exist' );
    } );

    it( 'searches a typeahead filter', () => {
      cy.get( '.state input' )
        .clear()
        .wait( 400 )
        .type( 'texas' );

      cy.get( '.state .typeahead-selector' )
        .should( 'exist' );

      cy.get( '.state .typeahead-selector li' )
        .contains( 'Texas' )
        .click();

      cy.get( '.pill-panel .pill' )
        .contains( 'TX' )
        .should( 'exist' );
    } );
  } );

} );
