export const waitForLoading = () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);
  cy.get('.loading-overlay .loading-overlay__box', {
    timeout: 30_000,
  }).should('not.exist');
};
