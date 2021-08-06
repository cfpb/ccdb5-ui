describe( 'List View', () => {
  const cardContainers = '.cards-panel .card-container'
  const currentPage = '.m-pagination_label'
  const nextButton = '.m-pagination .m-pagination_btn-next'
  const prevButton = '.m-pagination .m-pagination_btn-prev'
  beforeEach( () => {
    cy.intercept( '**/api/v1/**&field=all**sort=created_date_desc' )
        .as( 'getComplaints' )
    cy.intercept( 'GET', '**/api/v1/?**&size=0' )
      .as( 'getAggs' );
    cy.visit( Cypress.env( 'HOST' ) + '?size=10&searchText=debt%20recovery&tab=List' )
    cy.wait( '@getComplaints' );
    cy.wait( '@getAggs' );
  } )

  describe( 'initial rendering', () => {
    it( 'contains a list view', () => {
      cy.get( '.cards-panel' )
          .should( 'be.visible' )
      cy.get( cardContainers )
          .should( 'have.length', 10 )
    } )
  } )

  describe( 'Sort Drop-downs', () => {
    it( 'shows more results', () => {
      cy.get( cardContainers ).should( 'have.length', 10 )
      cy.url().should( 'contain', 'size=10' )

      cy.intercept( '**/api/v1/**search_after**' ).as( 'getNextComplaints' )

      cy.get( nextButton ).click()

      cy.wait( '@getNextComplaints' )

      cy.url().should( 'contain', 'page=2' )

      cy.log( 'reset the pager after sort' )

      cy.intercept( '**/api/v1/**size=10&sort=created_date_desc' )
        .as( 'get10Complaints' )

      cy.get( '#choose-size' ).select( '10 results' )

      cy.wait( '@get10Complaints' );

      cy.get( cardContainers ).should( 'have.length', 10 )
      cy.url().should( 'contain', 'size=10' )
      cy.url().should( 'contain', 'page=1' )

    } )

    it( 'changes the sort order', () => {
      cy.url().should( 'contain', 'sort=created_date_desc' )

      cy.intercept( '**/api/v1/**&field=all**&size=10&sort=relevance_desc' )
        .as( 'getRelevanceComplaints' )

      cy.intercept( '**/api/v1/**search_after**' )
        .as( 'getNextComplaints' )

      cy.get( nextButton ).click()
      cy.wait( '@getNextComplaints' )

      cy.url().should( 'contain', 'page=2' )

      cy.get( '#choose-sort' ).select( 'relevance_desc' )
      cy.wait( '@getRelevanceComplaints' );

      cy.url().should( 'contain', 'sort=relevance_desc' )

      cy.url().should( 'contain', 'page=1' )
    } )
  } )

  describe( 'Pagination', () => {
    it( 'exists', () => {
      cy.get( '.m-pagination' ).should( 'be.visible' )
    } )

    it( 'has a disabled prev button', () => {
      cy.get( prevButton ).should( 'be.disabled' )
      cy.get( nextButton ).should( 'not.be.disabled' )
    } )

    it( 'goes to the next page', () => {
      cy.get( nextButton ).click()

      cy.url().should( 'include', 'page=2' )
      cy.get( cardContainers ).should( 'have.length', 10 )

      cy.get( prevButton )
        .should( 'be.visible' )
        .should( 'not.have.class', 'a-btn__disabled' )

      cy.get( currentPage ).should( 'have.text', 'Page 2' )
    } )


    it( 'resets', () => {
      const fields = [ 'Company name', 'Narratives', 'All data' ];

      fields.forEach( field => {
        cy.log( `reset paging when search field changes to ${ field }` )

        cy.get( '#searchField' )
          .should( 'be.visible' )
          .select( field, { force: true } )

        cy.get( currentPage ).should( 'have.text', 'Page 1' )

        cy.get( nextButton )
            .should( 'be.visible' )
            .should( 'not.have.class', 'a-btn__disabled' )
            .click();

        cy.get( currentPage ).should( 'have.text', 'Page 2' );
      } )
    } )

  } )
} )
