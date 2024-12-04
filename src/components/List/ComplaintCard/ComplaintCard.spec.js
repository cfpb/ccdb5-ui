import { testRender as render, screen } from '../../../testUtils/test-utils';
import { ComplaintCard } from './ComplaintCard';

describe('ComplaintCard', () => {
  let itemFixture;
  beforeEach(() => {
    itemFixture = {
      complaint_what_happened: '',
      date_sent_to_company: '2022-11-16T12:00:00-05:00',
      zip_code: '12345',
      tags: null,
      has_narrative: false,
      issue: 'Incorrect information on your report',
      product:
        'Credit reporting, credit repair services, or other personal consumer reports',
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

  test('ComplaintCard renders with basic information', () => {
    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText(itemFixture.complaint_id)).toBeDefined();
    expect(screen.getByText('Company name')).toBeDefined();
    expect(screen.getByText(itemFixture.company)).toBeDefined();
    expect(screen.getByText('Date received:')).toBeDefined();
    expect(screen.getByText('11/16/2022')).toBeDefined();
    expect(screen.getByText(`Consumer’s state:`)).toBeDefined();
    expect(screen.getByText(itemFixture.state)).toBeDefined();
    expect(screen.getByText('Company response to consumer')).toBeDefined();
    expect(screen.getByText(itemFixture.company_response)).toBeDefined();
    expect(screen.getByText('Timely response?')).toBeDefined();
    expect(screen.getByText(itemFixture.timely)).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Product' })).toBeDefined();
    expect(screen.getByText(itemFixture.product)).toBeDefined();
    expect(screen.queryByText(/Sub-product:/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Issue' })).toBeDefined();
    expect(screen.getByText(itemFixture.issue)).toBeDefined();
    expect(screen.queryByText(/Sub-issue:/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Consumer Complaint Narrative' }),
    ).not.toBeInTheDocument();
  });

  test('Renders narrative without overflow', () => {
    itemFixture.has_narrative = true;
    itemFixture.complaint_what_happened = 'what happened goes here';
    const expectedItem = itemFixture;

    render(<ComplaintCard row={itemFixture} />);

    expect(
      screen.getByRole('heading', { name: /Consumer Complaint Narrative/ }),
    ).toBeDefined();
    expect(
      screen.getByText(expectedItem.complaint_what_happened),
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

    render(<ComplaintCard row={itemFixture} />);

    expect(
      screen.getByRole('heading', { name: /Consumer Complaint Narrative/ }),
    ).toBeDefined();
    expect(screen.getByText(expectedText)).toBeDefined();
    expect(screen.getByText('[...]')).toBeDefined();
  });

  test('Renders sub product', () => {
    itemFixture.sub_product = 'Credit reporting';

    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText(/Sub-product:/)).toBeDefined();
    expect(screen.getByText(itemFixture.sub_product)).toBeDefined();
  });

  test('Renders sub issue', () => {
    itemFixture.sub_issue = 'Public record information inaccurate';

    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText(/Sub-issue:/)).toBeDefined();
    expect(screen.getByText(itemFixture.sub_issue)).toBeDefined();
  });

  test('Strips highlighter HTML tags', () => {
    itemFixture.complaint_id = '<em>7990095</em>';

    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText(/7990095/).closest('a')).toHaveAttribute(
      'href',
      '/detail/7990095',
    );
  });
});
