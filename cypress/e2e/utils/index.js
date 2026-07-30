export const waitForLoading = () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);
  cy.get('.light-box .loading-box', { timeout: 30_000 }).should('not.exist');
};
