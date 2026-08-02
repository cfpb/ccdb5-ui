import { waitForLoading } from '../utils';

const pagination = () => cy.findByRole('navigation', { name: 'Pagination' });

describe('Complaint export', () => {
  const downloadWell = '[data-tour="download-complaint-data"]';
  const filteredDownload = `${downloadWell} .download-filtered-btn`;

  it('offers filtered download without pagination params', () => {
    cy.visit('?size=10&searchText=debt%20recovery&tab=List');
    waitForLoading();
    pagination().findByRole('button', { name: 'Next' }).click();
    cy.url().should('include', 'page=2');
    pagination().findByText('Page 2').should('exist');

    cy.get(downloadWell).should('be.visible');
    cy.get(downloadWell).should('contain.text', 'Download complaint data');
    cy.get(filteredDownload)
      .should('have.attr', 'href')
      .and('include', 'format=csv')
      .and('not.include', 'frm=')
      .and('not.include', 'search_after');
  });
});
