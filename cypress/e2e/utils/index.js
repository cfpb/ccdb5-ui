export const waitForLoading = () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);
  cy.get('.light-box .loading-box', { timeout: 30000 }).should('not.exist');
};
