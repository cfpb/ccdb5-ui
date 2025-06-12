export const waitForLoading = () => {
  cy.get('.light-box .loading-box', { timeout: 20000 }).should('not.exist');
};
