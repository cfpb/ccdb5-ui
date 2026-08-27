/// <reference types="cypress" />

import { waitForLoading } from '../utils';

const dateFilterButton = (name) =>
  cy.findByRole('button', {
    name: new RegExp(`${name} The date the CFPB received the complaint filter`),
  });

const productFilterButton = (name) =>
  cy.findByRole('button', {
    name: new RegExp(`${name} Product and sub-product filter`),
  });

const productSection = () => productFilterButton('Collapse').closest('section');

// Parent aggregation toggles are named by their visible text, which includes
// the complaint count alongside the product name.
const productToggle = (name) =>
  productSection().findByRole('button', {
    name: new RegExp(String.raw`^${name}\b`),
  });

const timelyFilterButton = (name) =>
  cy.findByRole('button', {
    name: new RegExp(
      String.raw`${name} Did the company provide a timely response\? filter`,
    ),
  });

const timelySection = () => timelyFilterButton('Collapse').closest('section');

const stateFilterButton = (name) =>
  cy.findByRole('button', {
    name: new RegExp(`${name} State filter`),
  });

const stateTypeahead = () =>
  cy.findByRole('combobox', {
    name: 'The state in the mailing address provided by the consumer.',
  });

const sizeSelect = () => cy.findByLabelText('Show per page');

const complaintLinks = () => cy.findAllByRole('link', { name: /^Complaint / });

const filterPills = () =>
  cy.findByText('Filters applied:').closest('section');

describe('Filter Panel', () => {
  it('allows the app to filter complaints', () => {
    cy.visit('/');
    waitForLoading();
    cy.log('it has filter panel');
    cy.findByRole('heading', { name: 'Filter results by' }).should(
      'be.visible',
    );
    waitForLoading();
    cy.log('is expanded');

    // ids are the label association targets; two "From"/"To" fields exist
    cy.get('#date-received-from').should('be.visible');

    cy.log('collapse it');
    dateFilterButton('Collapse').click();

    cy.get('#date-received-from').should('not.exist');

    cy.log('open it');
    dateFilterButton('Expand').click();
    cy.log('apply dates');
    cy.get('#date-received-from').should('be.visible');
    cy.get('#date-received-from').clear();
    waitForLoading();

    // electron / chrome headed version
    cy.get('#date-received-from').type('2015-09-11');
    cy.get('#date-received-from').focus();
    cy.get('#date-received-from').blur();
    waitForLoading();

    cy.url().should('include', 'date_received_min=2015-09-11');

    cy.log('apply a through date');

    cy.get('#date-received-through').clear();
    waitForLoading();
    cy.get('#date-received-through').type('2020-10-31');
    cy.get('#date-received-through').focus();
    cy.get('#date-received-through').blur();

    cy.url().should('include', 'date_received_max=2020-10-31');
    waitForLoading();
    // check error handling and default values
    cy.get('#date-received-from').type('2000-09-11');
    cy.get('#date-received-from').focus();
    cy.get('#date-received-from').blur();

    waitForLoading();
    cy.findByRole('button', { name: '3 years' }).click();
    // this will fail when the year hits 2030
    cy.url().should('include', `date_received_max=202`);
    cy.findByRole('button', { name: '6 months' }).click();
    cy.url().should('include', `date_received_max=202`);
    cy.log('can expand/collapse/apply filter group');
    // default date Filter pills
    cy.findAllByRole('button', { name: /Date received:/ }).should(
      'have.length',
      1,
    );
    waitForLoading();

    cy.log('close simple filter, as it is open by default');

    // Close it
    timelyFilterButton('Collapse').should('be.visible').click();
    cy.findByRole('button', {
      name: /Expand Did the company provide a timely response\? filter/,
    })
      .closest('section')
      .within(() => {
        cy.findByRole('checkbox', { name: 'Yes' }).should('not.exist');
      });

    cy.log('open it again');
    timelyFilterButton('Expand').click();
    waitForLoading();
    timelySection().within(() => {
      cy.findByRole('checkbox', { name: 'Yes' }).should('be.visible');
    });

    cy.log('apply filter');

    timelySection().within(() => {
      cy.findByRole('checkbox', { name: 'Yes' }).click({ force: true });
    });

    cy.url().should('include', 'timely=Yes');
    // Filter pill
    filterPills().within(() => {
      cy.findByRole('button', { name: 'Timely: Yes' }).should('exist');
    });

    // Filter clear button
    cy.findByRole('button', { name: 'Clear all filters' }).should('exist');
    cy.findByRole('button', { name: 'Clear all filters' }).click();

    cy.findByRole('button', { name: /Date received:/ }).should('not.exist');
    cy.findByRole('button', { name: 'Timely: Yes' }).should('not.exist');

    // Product/Sub-product
    cy.log('can collapse/expand a complex filter');
    productSection().within(() => {
      cy.findAllByRole('checkbox').should('have.length.gt', 1);
    });

    // close it
    productFilterButton('Collapse').click();
    cy.findByRole('checkbox', { name: 'Mortgage' }).should('not.exist');

    // open it
    productFilterButton('Expand').click();

    productSection().within(() => {
      cy.findAllByRole('checkbox').should('have.length.gt', 1);
    });

    cy.log('can expand sub-filters');

    cy.findByRole('checkbox', { name: /FHA mortgage/i }).should('not.exist');
    // Open sub-filter
    productToggle('Mortgage').click();
    cy.findByRole('checkbox', { name: /FHA mortgage/i }).should('exist');
    productToggle('Mortgage').click();
    cy.findByRole('checkbox', { name: /FHA mortgage/i }).should('not.exist');

    cy.log('toggles a filter by clicking checkbox input');
    cy.log('add filter');
    cy.findByRole('checkbox', { name: 'Mortgage' }).click({ force: true });
    waitForLoading();

    filterPills().within(() => {
      cy.findByRole('button', { name: 'Mortgage' }).should('exist');
    });
    cy.url().should('include', 'product=Mortgage');
    cy.log('remove filter');
    cy.findByRole('checkbox', { name: 'Mortgage' }).click({ force: true });
    waitForLoading();

    cy.url().should('not.include', 'product=Mortgage');

    cy.log('applies sub-filter by clicking');
    cy.findByRole('checkbox', { name: /FHA mortgage/i }).should('not.exist');
    // Open sub-filter
    productToggle('Mortgage').click();
    cy.findByRole('checkbox', { name: /FHA mortgage/i }).should('exist');
    cy.findByRole('checkbox', { name: /FHA mortgage/i }).click({
      force: true,
    });

    cy.url().should('include', '&product=Mortgage%E2%80%A2FHA%20mortgage');

    filterPills().within(() => {
      cy.findByRole('button', { name: /FHA mortgage/ }).should('exist');
    });

    cy.log('remove sub-filter when applying parent filter');
    cy.findByRole('checkbox', { name: 'Mortgage' }).click({ force: true });
    waitForLoading();

    filterPills().within(() => {
      cy.findByRole('button', { name: /FHA mortgage/ }).should('not.exist');
      cy.findByRole('button', { name: 'Mortgage' }).should('exist');
    });

    cy.url().should('not.include', '&product=Mortgage%E2%80%A2FHA%20mortgage');
    cy.url().should('include', 'product=Mortgage');
    cy.log('shows more results');
    complaintLinks().should('have.length', 25);
    sizeSelect().select('10 results');
    waitForLoading();
    complaintLinks().should('have.length', 10);

    cy.log('Typeahead Filters');
    // state
    cy.log('can collapse/expand and search a filter');
    stateTypeahead().should('be.visible');

    cy.log('close it');
    stateFilterButton('Collapse').click();

    stateTypeahead().should('not.exist');

    cy.log('open again');
    stateFilterButton('Expand').click();
    cy.log('searches a typeahead filter');
    stateTypeahead().clear();
    stateTypeahead().type('texas');

    cy.findByRole('option', { name: /Texas/ }).click();

    filterPills().within(() => {
      cy.findByRole('button', { name: /TX/ }).should('exist');
    });
  });
});
