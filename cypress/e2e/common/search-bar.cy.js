/// <reference types="cypress" />

describe('Search Bar', () => {
  const searchBar = '.search-bar';
  const searchFieldDropDown = '#searchField';
  const searchInput = '#searchText';

  beforeEach(() => {
    let request = '?**&size=0';
    let fixture = { fixture: 'common/get-aggs.json' };
    cy.intercept('GET', request, fixture).as('getAggs');

    request = '?**&sort=created_date_desc';
    fixture = { fixture: 'common/get-complaints.json' };
    cy.intercept(request, fixture).as('getComplaints');

    request = '**/ccdb/metadata.js';
    fixture = { fixture: 'metadata.js' };
    cy.intercept(request, fixture).as('metadata');

    const typeAheadRequest =
      '**/data-research/consumer-complaints/search/' +
      'api/v1/_suggest_company/**';
    cy.intercept(typeAheadRequest, {}).as('typeahead');
    cy.visit('?tab=List');
    cy.wait('@metadata');
    cy.wait('@getAggs');
    cy.wait('@getComplaints');
  });

  it('has a search bar', () => {
    cy.get(searchBar).should('be.visible');

    cy.get(searchFieldDropDown).select('company');
    cy.wait('@getComplaints');

    cy.get(searchFieldDropDown).select('complaint_what_happened');
    cy.wait('@getComplaints');
  });

  describe('Typeaheads', () => {
    it('has no typeahead functionality in All Data', () => {
      cy.get(searchInput).clear().wait(400).type('bank', { delay: 200 });
      cy.get('@typeahead.all').should('have.length', 0);
    });

    it('has no typeahead functionality in Narratives', () => {
      cy.get(searchFieldDropDown).select('complaint_what_happened');
      cy.wait('@getComplaints');

      cy.get(searchInput).clear().wait(400).type('bank', { delay: 200 });
      cy.get('@typeahead.all').should('have.length', 0);
    });

    it('has typeahead functionality in Company', () => {
      cy.get(searchFieldDropDown).select('company');
      cy.wait('@getComplaints');

      cy.get(searchInput).clear().wait(400).type('bank', { delay: 200 });

      cy.wait('@typeahead').wait('@typeahead').wait('@typeahead');

      cy.get('@typeahead.all').should('have.length', 3);
    });
  });
});
