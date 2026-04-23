import { waitForLoading } from '../utils';

describe('Complaint export', () => {
  const currentPage = '.m-pagination__label';
  const nextButton = '.m-pagination .m-pagination__btn-next';

  const appRoot = '#ccdb-ui-root';
  const exportButton = '.export-btn';
  const modalOverlay = '.ReactModalPortal .modal-overlay';
  const modalBody = '.ReactModalPortal .modal-body';
  const filteredDataset = 'label[for=dataset_filtered]';
  const exportUriInput = '.heres-the-url input';

  it('sends user to an export link without pagination params', () => {
    cy.visit('?size=10&searchText=debt%20recovery&tab=List');
    waitForLoading();
    cy.get(nextButton).click();
    cy.url().should('include', 'page=2');
    cy.get(currentPage).should('have.text', 'Page 2');

    cy.get(exportButton).click();
    cy.get(appRoot).then(($root) => {
      const overlayInRoot = $root.find(modalOverlay);
      if (overlayInRoot.length) {
        cy.wrap(overlayInRoot).should('be.visible');
        cy.wrap($root)
          .find(modalBody)
          .should('contain.text', 'Export complaints');
      } else {
        cy.get('body').find(modalOverlay).should('be.visible');
        cy.get('body')
          .find(modalBody)
          .should('contain.text', 'Export complaints');
      }
    });
    cy.get(filteredDataset).click();

    cy.get(exportUriInput).should('not.include.value', 'frm=');
    cy.get(exportUriInput).should('not.include.value', 'search_after=');
  });
});
