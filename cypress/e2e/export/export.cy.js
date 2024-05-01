describe('Complaint export', () => {
  const currentPage = '.m-pagination__label';
  const nextButton = '.m-pagination .m-pagination__btn-next';

  const exportButton = '.export-btn';
  const filteredDataset = 'label[for=dataset_filtered]';
  const exportUriInput = '.heres-the-url input';

  beforeEach(() => {
    let request = '?**&field=all**sort=created_date_desc';
    let fixture = { fixture: 'list/get-complaints.json' };
    cy.intercept(request, fixture).as('getComplaints');

    request = '?**&size=0';
    fixture = { fixture: 'list/get-aggs.json' };
    cy.intercept('GET', request, fixture).as('getAggs');

    cy.visit('?size=10&searchText=debt%20recovery&tab=List');
    cy.wait('@getComplaints');
    cy.wait('@getAggs');
  });

  it('sends user to an export link without pagination params', () => {
    cy.get(nextButton).click();
    cy.url().should('include', 'page=2');
    cy.get(currentPage).should('have.text', 'Page 2');

    cy.get(exportButton).click();
    cy.get(filteredDataset).click();

    cy.get(exportUriInput).should('not.include.value', 'frm=');
    cy.get(exportUriInput).should('not.include.value', 'search_after=');
  });
});
