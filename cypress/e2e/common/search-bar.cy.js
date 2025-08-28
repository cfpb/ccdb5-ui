/// <reference types="cypress" />

import { waitForLoading } from '../utils';

describe('Search Bar', () => {
  const searchBar = '.search-bar';
  const searchFieldDropDown = '#searchField';
  const typeAheadRequest =
    '**/data-research/consumer-complaints/search/' +
    'api/v1/_suggest_company/**';

  describe('Typeaheads', () => {
    it('has a search bar', () => {
      cy.visit('?tab=List');
      waitForLoading();
      cy.get(searchBar).should('be.visible');
      cy.get(searchFieldDropDown).select('company');
      waitForLoading();
      cy.get(searchFieldDropDown).select('complaint_what_happened');
      waitForLoading();
      cy.get(searchBar).should('be.visible');

      cy.log('has no typeahead functionality in All Data');
      cy.intercept(typeAheadRequest, { body: [] }).as('typeahead');
      cy.findByPlaceholderText('Enter your search term(s)').clear();
      cy.findByPlaceholderText('Enter your search term(s)').type('bank', {
        delay: 200,
      });
      cy.findByText('No matches found.').should('not.exist');

      cy.log('has no typeahead functionality in Narratives');
      cy.get(searchFieldDropDown).select('complaint_what_happened');
      waitForLoading();
      cy.findByPlaceholderText('Enter your search term(s)').clear();
      cy.findByPlaceholderText('Enter your search term(s)').type('bank', {
        delay: 200,
      });
      cy.findByText('No matches found.').should('not.exist');

      cy.log('has typeahead functionality in Company');
      cy.intercept(typeAheadRequest, {
        body: [
          'Bank of America, National Association',
          'CITIBANK, N.A.',
          'Discover Bank',
        ],
      }).as('typeahead');
      cy.get(searchFieldDropDown).select('company');
      waitForLoading();
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
