import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { ComplaintCard } from './ComplaintCard';
import { IntlProvider } from 'react-intl';

describe('ComplaintCard', () => {
  let itemFixture;
  beforeEach(() => {
    itemFixture = {
      complaint_what_happened: '',
      date_sent_to_company: '2022-11-16T12:00:00-05:00',
      zip_code: '12345',
      tags: null,
      has_narrative: false,
      complaint_id: '7990095',
      timely: 'Yes',
      consumer_consent_provided: null,
      company_response: 'In progress',
      submitted_via: 'Web',
      company: 'JP Morgan',
      date_received: '2022-11-16T12:00:00-05:00',
      state: 'FL',
      consumer_disputed: 'N/A',
      company_public_response: null,
    };
  });

  test('it renders correctly', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <ComplaintCard row={itemFixture} />
        </IntlProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('ComplaintCard renders with basic information', () => {
    render(
      <IntlProvider locale="en">
        <ComplaintCard row={itemFixture} />
      </IntlProvider>
    );

    expect(screen.getByText(itemFixture.company)).toBeDefined();
    expect(screen.getByText('11/16/2022')).toBeDefined();
    expect(screen.getByText(itemFixture.state)).toBeDefined();
    expect(screen.getByText(itemFixture.company_response)).toBeDefined();
    expect(screen.getByText(itemFixture.timely)).toBeDefined();
  });

  test('Renders narrative without overflow', () => {
    itemFixture.has_narrative = true;
    itemFixture.complaint_what_happened = 'what happened goes here';
    const expectedItem = itemFixture;

    render(
      <IntlProvider locale="en">
        <ComplaintCard row={itemFixture} />
      </IntlProvider>
    );

    expect(
      screen.getByRole('heading', { name: /Consumer Complaint Narrative/ })
    ).toBeDefined();
    expect(
      screen.getByText(expectedItem.complaint_what_happened)
    ).toBeDefined();
  });

  test('Renders narrative with overflow', () => {
    itemFixture.has_narrative = true;
    itemFixture.complaint_what_happened =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Donec elit ante, mollis eu dolor sed, gravida tincidunt dui. ' +
      'Integer elementum ante mauris, vel vulputate nulla tristique ut. ' +
      'Vestibulum tincidunt nunc eget porta pulvinar. Mauris ullamcorper, ' +
      'diam et eleifend auctor, odio nulla dapibus odio porta ante.';
    const expectedText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Donec elit ante, mollis eu dolor sed, gravida tincidunt dui. ' +
      'Integer elementum ante mauris, vel vulputate nulla tristique ut. ' +
      'Vestibulum tincidunt nunc eget porta pulvinar. Mauris ullamcorper, ' +
      'diam et eleifend auctor, odio nulla dapibus odio p';

    render(
      <IntlProvider locale="en">
        <ComplaintCard row={itemFixture} />
      </IntlProvider>
    );

    expect(
      screen.getByRole('heading', { name: /Consumer Complaint Narrative/ })
    ).toBeDefined();
    expect(screen.getByText(expectedText)).toBeDefined();
    expect(screen.getByText('[...]')).toBeDefined();
  });

  test('Renders product and sub product', () => {
    itemFixture.product =
      'Credit reporting, credit repair services, or other personal consumer reports';
    itemFixture.sub_product = 'Credit reporting';

    render(
      <IntlProvider locale="en">
        <ComplaintCard row={itemFixture} />
      </IntlProvider>
    );

    expect(screen.getByText(itemFixture.product)).toBeDefined();
    expect(screen.getByText(itemFixture.sub_product)).toBeDefined();
  });

  test('Renders issue and sub issue', () => {
    itemFixture.issue = 'Incorrect information on your report';
    itemFixture.sub_issue = 'Public record information inaccurate';

    render(
      <IntlProvider locale="en">
        <ComplaintCard row={itemFixture} />
      </IntlProvider>
    );

    expect(screen.getByText(itemFixture.issue)).toBeDefined();
    expect(screen.getByText(itemFixture.sub_issue)).toBeDefined();
  });
});
