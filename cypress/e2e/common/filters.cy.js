/// <reference types="cypress" />

import { waitForLoading } from '../utils';

describe('Filter Panel', () => {
  beforeEach(() => {
    cy.visit('?tab=List');
    waitForLoading();
  });

  describe('Date Received Filter', () => {
    it('has basic functionality', () => {
      cy.log('it has filter panel');
      cy.get('.filter-panel').should('be.visible');
      waitForLoading();
      cy.log('is expanded');

      cy.get('#date_received-from').should('be.visible');

      cy.log('collapse it');
      cy.get('.date-filter > button.o-expandable__header:first').click();

      cy.get('#date-received-agg #start_date').should('not.exist');

      cy.log('open it');
      cy.get('.date-filter > button.o-expandable__header:first').click();
      cy.log('apply dates');
      cy.get('#date_received-from').should('be.visible');
      cy.get('#date_received-from').clear();
      waitForLoading();

      // electron / chrome headed version
      cy.get('#date_received-from').type('2015-09-11');
      cy.get('#date_received-from').focus();
      cy.get('#date_received-from').blur();
      waitForLoading();

      cy.url().should('include', 'date_received_min=2015-09-11');

      cy.log('apply a through date');

      cy.get('#date_received-through').clear();
      waitForLoading();
      cy.get('#date_received-through').type('2020-10-31');
      cy.get('#date_received-through').focus();
      cy.get('#date_received-through').blur();

      cy.url().should('include', 'date_received_max=2020-10-31');
      waitForLoading();
      // check error handling and default values
      cy.get('#date_received-from').type('2000-09-11');
      cy.get('#date_received-from').focus();
      cy.get('#date_received-from').blur();

      waitForLoading();
      cy.url().should('include', 'date_received_min=2011-12-01');
    });

    it('can trigger a pre-selected date range', () => {
      cy.get('button.map').click();
      waitForLoading();
      cy.get('.date-ranges .a-btn.range-3y').contains('3y').click();
      // this will fail when the year hits 2030
      cy.url().should('include', `date_received_max=202`);
      cy.get('.date-ranges .a-btn.range-6m').contains('6m').click();
      cy.url().should('include', `date_received_max=202`);
    });
  });

  describe('Filter Groups', () => {
    it('can expand/collapse/apply filter group', () => {
      // default date Filter pills
      cy.get('.pill-panel .pill').should('have.length', 1);
      waitForLoading();

      cy.log('close simple filter, as it is open by default');

      // Close it
      cy.get('.timely > .o-expandable__header').should('be.visible');
      cy.get('.timely button.o-expandable__header').click();
      cy.get(
        '.timely > .o-expandable__content > ul > :nth-child(1) > .a-label',
      ).should('not.exist');

      cy.log('open it again');
      cy.get('.timely > .o-expandable__header').click();
      waitForLoading();
      cy.get(
        '.timely > .o-expandable__content > ul > :nth-child(1) > .a-label',
      ).should('be.visible');

      cy.log('apply filter');

      cy.get(
        '.timely > .o-expandable__content > ul > :nth-child(1) > .a-label',
      ).click();

      cy.url().should('include', 'timely=Yes');
      // Filter pill
      cy.get('.pill-panel .pill').contains('Timely: Yes').should('exist');

      // Filter clear button
      cy.get('li.clear-all').should('exist');
      cy.get('li.clear-all').click();

      cy.get('.pill-panel .pill').should('not.exist');

      // Product/Sub-product
      cy.log('can collapse/expand a complex filter');
      cy.get('.filter-panel .product .aggregation-branch').should(
        'have.length.gt',
        1,
      );

      // close it
      cy.get('.filter-panel .product .o-expandable__cue-close').click();
      cy.get('.filter-panel .product .aggregation-branch').should(
        'have.length',
        0,
      );

      // open it
      cy.get('.filter-panel .product .o-expandable__cue-open').click();

      cy.get('.filter-panel .product .aggregation-branch').should(
        'have.length.gt',
        1,
      );

      cy.log('can expand sub-filters');

      cy.get('.filter-panel .product .children').should('not.exist');
      // Open sub-filter
      cy.get(
        '.filter-panel .product .aggregation-branch:first .a-btn--link',
      ).click();
      cy.get('.filter-panel .product .children').should('exist');
      cy.get(
        '.filter-panel .product .aggregation-branch:first .a-btn--link',
      ).click();
      cy.get('.filter-panel .product .children').should('not.exist');

      cy.log('toggles a filter by clicking checkbox input');
      cy.log('add filter');
      cy.get('input#product-mortgage').click({ force: true });
      waitForLoading();

      cy.get('.pill-panel .pill').contains('Mortgage').should('exist');
      cy.url().should('include', 'product=Mortgage');
      cy.log('remove filter');
      cy.get('input#product-mortgage').click({ force: true });
      waitForLoading();

      cy.url().should('not.include', 'product=Mortgage');

      cy.log('applies sub-filter by clicking');
      cy.get('.filter-panel .product .children').should('not.exist');
      // Open sub-filter
      cy.get(
        '.filter-panel .product .aggregation-branch.mortgage button',
      ).click();
      cy.get(
        '.filter-panel .product .aggregation-branch.mortgage+.children',
      ).should('exist');
      cy.get(
        '.filter-panel .product input#product-mortgage-fha-mortgage',
      ).click({ force: true });

      cy.url().should('include', '&product=Mortgage%E2%80%A2FHA%20mortgage');

      cy.get('.pill-panel .pill').contains('FHA mortgage').should('exist');

      cy.log('remove sub-filter when applying parent filter');
      cy.get('input#product-mortgage').click({ force: true });
      waitForLoading();

      cy.get('.pill-panel .pill').contains('FHA mortgage').should('not.exist');

      cy.url().should(
        'not.include',
        '&product=Mortgage%E2%80%A2FHA%20mortgage',
      );
      cy.url().should('include', 'product=Mortgage');

      cy.log('shows more results');
      cy.get('.list-panel .card-container').should('have.length', 25);
      cy.get('#select-size').select('10 results');
      waitForLoading();
      cy.get('.list-panel .card-container').should('have.length', 10);

      cy.log('Typeahead Filters');
      // state
      cy.log('can collapse/expand and search a filter');
      cy.get('.state input').should('be.visible');

      cy.log('close it');
      cy.get('.state .o-expandable__cues').click();

      cy.get('.state input').should('not.exist');

      cy.log('open again');
      cy.get('.state .o-expandable__cues').click();
      cy.log('searches a typeahead filter');
      cy.findByPlaceholderText('Enter state name or abbreviation').clear();
      cy.findByPlaceholderText('Enter state name or abbreviation').type(
        'texas',
      );

      cy.get('.state .typeahead-selector').should('exist');

      cy.get('.state .typeahead-selector li').contains('Texas').click();

      cy.get('.pill-panel .pill').contains('TX').should('exist');
    });
  });
});
