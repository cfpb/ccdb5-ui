/// <reference types="cypress" />

import dayjs from 'dayjs';

describe('Filter Panel', () => {
  beforeEach(() => {
    let request = '?**&size=0';
    let fixture = { fixture: 'common/get-aggs.json' };
    cy.intercept('GET', request, fixture).as('getAggs');

    request = '?**&sort=created_date_desc';
    fixture = { fixture: 'common/get-complaints.json' };
    cy.intercept(request, fixture).as('getComplaints');

    request = '**/ccdb/metadata.js';
    fixture = { fixture: 'metadata.json' };
    cy.intercept(request, fixture).as('metadata');

    cy.visit('?tab=List');
    cy.wait('@metadata');
    cy.wait('@getAggs');
    cy.wait('@getComplaints');
  });

  describe('Date Received Filter', () => {
    it('has basic functionality', () => {
      cy.log('it has filter panel');
      cy.get('.filter-panel').should('be.visible');
      let request = '?**&date_received_min=2015-09-11**';
      let fixture = { fixture: 'common/get-complaints-date-from.json' };
      cy.intercept(request, fixture).as('getComplaintsDateFrom');

      request = '?date_received_max=2020-10-31**';
      fixture = { fixture: 'common/get-complaints-date-to.json' };
      cy.intercept(request, fixture).as('getComplaintsDateTo');

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.log('is expanded');

      cy.get('#date_received-from').should('be.visible');

      cy.log('collapse it');
      cy.get('.date-filter > button.o-expandable__header:first').click({
        force: true,
      });

      cy.get('#date-received-agg #start_date').should('not.exist');

      cy.log('open it');
      cy.get('.date-filter > button.o-expandable__header:first').click({
        force: true,
      });
      cy.log('apply dates');

      cy.get('#date_received-from').clear({
        force: true,
      });

      // TODO: this fails in headless mode for some reason without force:true but it works fine in
      // electron / chrome headed version
      cy.get('#date_received-from').type('2015-09-11', {
        force: true,
      });
      cy.get('#date_received-from').blur();

      cy.wait('@getComplaintsDateFrom');

      cy.url().should('include', 'date_received_min=2015-09-11');

      cy.log('apply a through date');

      cy.get('#date_received-through').clear({
        force: true,
      });

      // TODO: this fails in headless mode for some reason without force:true but it works fine in
      // electron / chrome headed version
      cy.get('#date_received-through').type('2020-10-31', {
        force: true,
      });
      cy.get('#date_received-through').blur();

      cy.url().should('include', 'date_received_max=2020-10-31');

      cy.wait('@getComplaintsDateTo');
    });

    it('can trigger a pre-selected date range', () => {
      const request = '**/geo/states?**&size=0';
      const fixture = { fixture: 'common/get-geo.json' };
      cy.intercept(request, fixture).as('getGeo');

      cy.get('button.map').click();
      cy.wait('@getGeo');
      const maxDate = dayjs(new Date()).format('YYYY-MM-DD');
      let minDate = dayjs(new Date()).subtract(3, 'years').format('YYYY-MM-DD');
      cy.get('.date-ranges .a-btn.range-3y').contains('3y').click();
      cy.url().should(
        'include',
        `date_received_max=${maxDate}&date_received_min=${minDate}`,
      );
      minDate = dayjs(new Date()).subtract(6, 'months').format('YYYY-MM-DD');
      cy.get('.date-ranges .a-btn.range-6m').contains('6m').click();
      cy.url().should(
        'include',
        `date_received_max=${maxDate}&date_received_min=${minDate}`,
      );
    });
  });

  describe('Filter Groups', () => {
    it('can expand/collapse/apply filter group', () => {
      // default date Filter pills
      cy.get('.pill-panel .pill').should('have.length', 1);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(750);

      cy.log('close simple filter, as it is open by default');

      // Close it
      cy.get('.timely > .o-expandable__header').should('be.visible').click();
      cy.get(
        '.timely > .o-expandable__content > ul > :nth-child(1) > .a-label',
      ).should('not.exist');

      cy.log('open it again');
      cy.get('.timely > .o-expandable__header').click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(750);

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
      cy.get('li.clear-all').should('exist').click();

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

      cy.wait('@getAggs');

      cy.get('.pill-panel .pill').contains('Mortgage').should('exist');
      cy.url().should('include', 'product=Mortgage');
      cy.log('remove filter');
      cy.get('input#product-mortgage').click({ force: true });
      cy.wait('@getAggs');

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
      cy.wait('@getComplaints');

      cy.get('.pill-panel .pill').contains('FHA mortgage').should('not.exist');

      cy.url().should(
        'not.include',
        '&product=Mortgage%E2%80%A2FHA%20mortgage',
      );
      cy.url().should('include', 'product=Mortgage');

      cy.log('shows more results');
      const request = '?**&size=10**';
      const fixture = { fixture: 'common/get-10-complaints.json' };
      cy.intercept('GET', request, fixture).as('get10Complaints');

      cy.get('.list-panel .card-container').should('have.length', 25);
      cy.get('#select-size').select('10 results');
      cy.wait('@get10Complaints');
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
