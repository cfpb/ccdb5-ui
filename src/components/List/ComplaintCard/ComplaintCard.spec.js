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

    expect(screen.getByText(itemFixture.complaint_id)).toBeInTheDocument();
    expect(screen.getByText('Company name')).toBeInTheDocument();
    expect(screen.getByText(itemFixture.company)).toBeInTheDocument();
    expect(screen.getByText('Date received:')).toBeInTheDocument();
    expect(screen.getByText('11/16/2022')).toBeInTheDocument();
    expect(screen.getByText(`Consumer’s state:`)).toBeInTheDocument();
    expect(screen.getByText(itemFixture.state)).toBeInTheDocument();
    expect(
      screen.getByText('Company response to consumer'),
    ).toBeInTheDocument();
    expect(screen.getByText(itemFixture.company_response)).toBeInTheDocument();
    expect(screen.getByText('Timely response?')).toBeInTheDocument();
    expect(screen.getByText(itemFixture.timely)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Product' }),
    ).toBeInTheDocument();
    expect(screen.getByText(itemFixture.product)).toBeInTheDocument();
    expect(screen.queryByText(/Sub-product:/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Issue' })).toBeInTheDocument();
    expect(screen.getByText(itemFixture.issue)).toBeInTheDocument();
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
    ).toBeInTheDocument();
    expect(
      screen.getByText(expectedItem.complaint_what_happened),
    ).toBeInTheDocument();
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
    ).toBeInTheDocument();
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.getByText('[...]')).toBeInTheDocument();
  });

  test('Renders sub product', () => {
    itemFixture.sub_product = 'Credit reporting';

    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText(/Sub-product:/)).toBeInTheDocument();
    expect(screen.getByText(itemFixture.sub_product)).toBeInTheDocument();
  });

  test('Renders sub issue', () => {
    itemFixture.sub_issue = 'Public record information inaccurate';

    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText(/Sub-issue:/)).toBeInTheDocument();
    expect(screen.getByText(itemFixture.sub_issue)).toBeInTheDocument();
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
