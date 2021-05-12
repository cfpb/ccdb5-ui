/// <reference types="cypress" />

describe( 'List View', () => {
  beforeEach( () => {
    cy.visit( Cypress.env( 'HOST' ) + '?tab=List' )
  } )

  describe( 'initial rendering', () => {
    it( 'contains a list view', () => {
      cy.get( '.cards-panel' )
        .should( 'be.visible' )
      cy.get( '.cards-panel .card-container' )
        .should( 'have.length', 25 )
    } )
  } )

  describe( 'Sort Drop-downs', () => {
    it( 'shows more results', () => {
      cy.get( '.list-panel .card-container' )
        .should( 'have.length', 25 )
      cy.url()
        .should( 'contain', 'size=25' )
      cy.get( '#choose-size' )
        .select( '10 results' )
      cy.get( '.list-panel .card-container' )
        .should( 'have.length', 10 )
      cy.url()
        .should( 'contain', 'size=10' )
    } )

    it( 'changes the sort order', () => {
      cy.url()
        .should( 'contain', 'sort=created_date_desc' )
      cy.get( '#choose-sort' )
        .select( 'Relevance' )
      cy.url()
        .should( 'contain', 'sort=relevance_desc' )
    } )
  } )

  describe( 'Pagination', () => {
    it( 'exists', () => {
      cy.get( '.m-pagination' )
        .should( 'be.visible' )
    } )

    it( 'has a disabled prev button', () => {
      cy.get( '.m-pagination .m-pagination_btn-prev' )
        .should( 'be.disabled' )
      cy.get( '.m-pagination .m-pagination_btn-next' )
        .should( 'not.be.disabled' )
    } )

    it( 'goes to the next page', () => {
      cy.get( '.m-pagination .m-pagination_btn-next' )
        .click()

      cy.url()
        .should( 'include', 'page=2' )
      cy.get( '.list-panel .card-container' )
        .should( 'have.length', 25 )

      cy.get( '.m-pagination .m-pagination_btn-prev' )
        .should( 'be.visible' )
        .should( 'not.have.class', 'a-btn__disabled' )

      cy.get( '.m-pagination_current-page' )
        .should( 'have.value', '2' )
    } )
    // this logic needs to be implemented on the front-end
    //     const fields = ['Attachments', 'Company Response', 'Narratives'];
    //
    //     fields.forEach(field=>{
    //       cy.log(`reset paging when search field changes to ${field}`);
    //
    //       cy.get('#search_input_form button.dropdown-toggle')
    //         .click();
    //
    //       cy.contains('#search_input_form .dropdown-menu li', field)
    //         .click();
    //
    //       cy.get( '#m-pagination_current-page' )
    //         .should( 'have.value', '1' );
    //
    //       cy.get( '#pagination_content .m-pagination_btn-next' )
    //         .should( 'be.visible' )
    //         .should( 'not.have.class', 'a-btn__disabled' )
    //         .click();
    //
    //       cy.get( '#m-pagination_current-page' )
    //         .should( 'have.value', '2' );
    //     })
    //   } );
    //
    //
    //
    it( 'accepts typing page number', () => {
      cy.get( '.m-pagination_current-page' )
        .clear()
        .type( 3 )

      cy.get( '.m-pagination_btn-submit' )
        .click()
      cy.url()
        .should( 'contain', 'page=3' )
    } )

  } )
} )
