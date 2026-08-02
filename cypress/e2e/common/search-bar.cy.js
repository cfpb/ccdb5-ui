/// <reference types="cypress" />

import { waitForLoading } from '../utils';

const searchField = () =>
  cy.findByLabelText('Choose which field will be searched');

const searchInput = () =>
  cy.findByRole('searchbox', {
    name: /Enter the term you want to search for/,
  });

const companySearchInput = () =>
  cy.findByRole('combobox', {
    name: /Enter your search term\(s\)/,
  });

const typeAheadRequest =
  '**/data-research/consumer-complaints/search/' +
  'api/v1/_suggest_company/**';

describe('Search Bar', () => {
  describe('Typeaheads', () => {
    it('has a search bar', () => {
      cy.visit('?tab=List');
      waitForLoading();
      cy.findByRole('search').should('be.visible');
      searchField().select('company');
      waitForLoading();
      searchField().select('complaint_what_happened');
      waitForLoading();
      cy.findByRole('search').should('be.visible');

      cy.log('has no typeahead functionality in All Data');
      cy.intercept(typeAheadRequest, { body: [] }).as('typeahead');
      searchInput().clear();
      searchInput().type('bank', {
        delay: 200,
      });
      cy.findByText('No matches found.').should('not.exist');

      cy.log('has no typeahead functionality in Narratives');
      searchField().select('complaint_what_happened');
      waitForLoading();
      searchInput().clear();
      searchInput().type('bank', {
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
      searchField().select('company');
      waitForLoading();
      companySearchInput().clear();
      companySearchInput().type('bank', {
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

  describe('Advanced search tips', () => {
    it('toggles search tips', () => {
      cy.visit('?tab=List');
      waitForLoading();

      cy.findByRole('heading', { name: 'Search tips' }).should('not.exist');
      cy.findByRole('button', { name: 'Show search tips' }).click();
      cy.findByRole('heading', { name: 'Search tips' }).should('be.visible');
      cy.findByRole('button', { name: 'Hide search tips' }).click();
      cy.findByRole('heading', { name: 'Search tips' }).should('not.exist');
      cy.findByRole('button', {
        name: 'Show search tips',
      }).should('be.visible');
    });
  });

  describe('Search submit', () => {
    it('submits an All data search', () => {
      cy.visit('?tab=List');
      waitForLoading();

      searchField().select('all');
      waitForLoading();
      searchInput().clear();
      searchInput().type('mortgage');
      cy.findByRole('button', { name: 'Search' }).click();
      waitForLoading();

      cy.url().should('include', 'searchText=mortgage');
      cy.findByRole('heading', { name: /Showing .* complaints/ }).should(
        'be.visible',
      );
    });
  });
});
