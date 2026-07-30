import { waitForLoading } from '../utils';

describe('Complaint export', () => {
  const currentPage = '.m-pagination__label';
  const nextButton = '.m-pagination .m-pagination__btn-next';
  const downloadWell = '[data-tour="download-complaint-data"]';
  const filteredDownload = `${downloadWell} .download-filtered-btn`;

  it('offers filtered download without pagination params', () => {
    cy.visit('?size=10&searchText=debt%20recovery&tab=List');
    waitForLoading();
    cy.get(nextButton).click();
    cy.url().should('include', 'page=2');
    cy.get(currentPage).should('have.text', 'Page 2');

    cy.get(downloadWell).should('be.visible');
    cy.get(downloadWell).should('contain.text', 'Download complaint data');
    cy.get(filteredDownload)
      .should('have.attr', 'href')
      .and('include', 'format=csv')
      .and('not.include', 'frm=')
      .and('not.include', 'search_after');
  });
});
