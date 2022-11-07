/// <reference types="cypress" />

describe('Search Bar', () => {
  const searchBar = '.search-bar';
  const searchFieldDropDown = '#searchField';
  const typeAheadRequest =
    '**/data-research/consumer-complaints/search/' +
    'api/v1/_suggest_company/**';

  beforeEach(() => {
    let request = '?**&size=0';
    let fixture = { fixture: 'common/get-aggs.json' };
    cy.intercept('GET', request, fixture).as('getAggs');

    request = '?**&sort=created_date_desc';
    fixture = { fixture: 'common/get-complaints.json' };
    cy.intercept(request, fixture).as('getComplaints');

    request = '**/ccdb/metadata.js';
    fixture = { fixture: 'metadata.json' };
    cy.intercept(request, fixture).as('metadata');

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
      cy.intercept(typeAheadRequest, { body: [] }).as('typeahead');
      cy.findByPlaceholderText('Enter your search term(s)').clear();
      cy.findByPlaceholderText('Enter your search term(s)').type('bank', {
        delay: 200,
      });
      cy.findByText('No matches found.').should('not.exist');
    });

    it('has no typeahead functionality in Narratives', () => {
      cy.intercept(typeAheadRequest, { body: [] }).as('typeahead');
      cy.get(searchFieldDropDown).select('complaint_what_happened');
      cy.wait('@getComplaints');

      cy.findByPlaceholderText('Enter your search term(s)').clear();
      cy.findByPlaceholderText('Enter your search term(s)').type('bank', {
        delay: 200,
      });
      cy.findByText('No matches found.').should('not.exist');
    });

    it('has typeahead functionality in Company', () => {
      cy.intercept(typeAheadRequest, {
        body: [
          'Bank of America, National Association',
          'CITIBANK, N.A.',
          'Discover Bank',
        ],
      }).as('typeahead');
      cy.get(searchFieldDropDown).select('company');
      cy.wait('@getComplaints');

      cy.findByPlaceholderText('Enter your search term(s)').clear();
      cy.findByPlaceholderText('Enter your search term(s)').type('bank', {
        delay: 200,
      });

      cy.findAllByRole('option', {
        name: 'Bank of America, National Association',
      }).should('exist');
      cy.findAllByRole('option', {
        name: 'CITIBANK, N.A.',
      }).should('exist');
      cy.findAllByRole('option', {
        name: 'Discover Bank',
      }).should('exist');
    });
  });
});
