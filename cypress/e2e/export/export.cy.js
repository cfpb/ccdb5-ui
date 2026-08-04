import { waitForLoading } from '../utils';

const pagination = () => cy.findByRole('navigation', { name: 'Pagination' });

describe('Complaint export', () => {
  it('sends user to an export link without pagination params', () => {
    cy.visit('?size=10&searchText=debt%20recovery&tab=List');
    waitForLoading();
    pagination().findByRole('button', { name: 'Next' }).click();
    cy.url().should('include', 'page=2');
    pagination().findByText('Page 2').should('exist');

    cy.findByRole('button', { name: 'Export data' }).click();
    cy.findByRole('dialog', { name: 'CFPB Modal Dialog' }).should(
      'be.visible',
    );
    cy.findByRole('heading', { name: 'Export complaints' }).should(
      'be.visible',
    );
    cy.findByRole('radio', { name: /Filtered dataset/ }).click({
      force: true,
    });

    cy.findByRole('dialog', { name: 'CFPB Modal Dialog' })
      .findByRole('textbox')
      .should('not.include.value', 'frm=')
      .and('not.include.value', 'search_after=');
  });
});
