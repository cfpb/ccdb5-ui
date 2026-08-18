/// <reference types="cypress" />

import { waitForLoading } from '../utils';

describe('Hero', () => {
  it('opens and closes the Things to know modal', () => {
    cy.visit('/');
    waitForLoading();

    cy.findByRole('button', {
      name: 'Things to know before you use this database',
    }).click();

    cy.findByRole('dialog', { name: 'CFPB Modal Dialog' }).should(
      'be.visible',
    );
    cy.findByRole('heading', {
      name: 'Things you should know before you use this database',
    }).should('be.visible');

    cy.findByRole('dialog', { name: 'CFPB Modal Dialog' })
      .findByRole('button', { name: 'Close' })
      .click();

    cy.findByRole('dialog', { name: 'CFPB Modal Dialog' }).should(
      'not.exist',
    );
  });
});
