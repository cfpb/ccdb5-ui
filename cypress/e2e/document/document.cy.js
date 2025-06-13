/// <reference types="cypress" />

import { waitForLoading } from '../utils';

describe('Document View', () => {
  describe('error handling', () => {
    it('handles bogus id', () => {
      cy.visit('/detail/ThisIsNotAValidId');
      cy.findByRole('heading', {
        name: 'There was a problem retrieving ThisIsNotAValidId',
      }).should('be.visible');
    });
  });

  describe('document detail view', () => {
    beforeEach(() => {
      cy.visit('?tab=List');
      waitForLoading();
    });
    it('navigates to document detail', () => {
      cy.get('.cards-panel .card-container a').first().click();

      cy.url().should('contain', '/detail');

      cy.log('go back to search');
      cy.get('.back-to-search a').contains('Back to search results').click();

      cy.url().should('not.contain', '/detail');
    });
  });

  describe('preserve page state', () => {
    it('restores filters after visiting document detail', () => {
      cy.visit(
        '?searchText=pizza&has_narrative=true&size=10&sort=relevance_desc&tab=List',
      );

      cy.get('select#select-sort option:selected').should(
        'have.text',
        'Relevance',
      );

      cy.contains('.pill', 'Has narrative').should('be.visible');

      cy.get('#filterHasNarrative').should('be.checked');
      cy.get('.cards-panel .card-container a').first().click();

      waitForLoading();

      cy.url().should('contain', '/detail');

      cy.get('.back-to-search a').contains('Back to search results').click();

      waitForLoading();

      cy.get('select#select-sort option:selected').should(
        'have.text',
        'Relevance',
      );

      cy.contains('.pill', 'Has narrative').should('be.visible');

      cy.get('#filterHasNarrative').should('be.checked');
    });
  });
});
