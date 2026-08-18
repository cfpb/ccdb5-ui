import { waitForLoading } from '../utils';

const pagination = () => cy.findByRole('navigation', { name: 'Pagination' });

describe('Complaint export', () => {
  it('opens download modal for filtered results under the limit', () => {
    cy.visit('?size=10&searchText=debt%20recovery');
    waitForLoading();
    pagination().findByRole('button', { name: 'Next' }).click();
    cy.url().should('include', 'page=2');
    pagination().findByText('Page 2').should('exist');

    cy.findByRole('button', { name: 'Export data' }).click();
    cy.findByRole('dialog', { name: 'CFPB Modal Dialog' }).should(
      'be.visible',
    );
    cy.findByRole('heading', { name: 'Download complaint data' }).should(
      'be.visible',
    );
    cy.findByRole('dialog', { name: 'CFPB Modal Dialog' })
      .findByRole('radio', { name: /JSON/i })
      .should('not.exist');
    cy.findByText(/Select a format for the exported file/).should('not.exist');

    cy.findByRole('radio', { name: /Filtered results/ })
      .should('be.enabled')
      .and('be.checked');
    cy.findByText(
      /You must add search terms or apply filters to download filtered results/,
    ).should('not.exist');
    cy.findByText(/exceed download limits/).should('not.exist');

    cy.findByRole('button', { name: /Download data/ }).should('be.visible');
    cy.findByRole('button', { name: /Copy link/ }).should('be.visible');
    cy.findByRole('heading', {
      name: 'Save a link to your filtered results',
    }).should('be.visible');
  });
});
