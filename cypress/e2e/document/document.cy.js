/// <reference types="cypress" />

import { waitForLoading } from '../utils';

const firstComplaintLink = () =>
  cy.findAllByRole('link', { name: /^Complaint / }).first();

const backToSearch = () =>
  cy.findByRole('link', { name: 'Back to search results' });

const sortSelect = () => cy.findByLabelText('Sort by');

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
      cy.visit('/');
      waitForLoading();
    });
    it('navigates to document detail', () => {
      firstComplaintLink().click();

      cy.url().should('contain', '/detail');

      cy.log('go back to search');
      backToSearch().click();

      cy.url().should('not.contain', '/detail');
    });
  });

  describe('preserve page state', () => {
    it('restores filters after visiting document detail', () => {
      cy.visit('?searchText=pizza&size=10&sort=relevance_desc');

      sortSelect().find('option:selected').should('have.text', 'Most relevant');

      firstComplaintLink().click();

      waitForLoading();

      cy.url().should('contain', '/detail');

      backToSearch().click();

      waitForLoading();

      sortSelect().find('option:selected').should('have.text', 'Most relevant');
    });
  });
});
