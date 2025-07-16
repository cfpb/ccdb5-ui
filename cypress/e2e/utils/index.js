export const waitForLoading = () => {
  cy.get('.light-box .loading-box', { timeout: 30000 }).should('not.exist');
};
