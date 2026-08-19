import { screen, testRender as render } from '../../../test-utils/test-utils';
import { ComplaintCard } from './complaint-card';

describe('ComplaintCard', () => {
  let itemFixture;
  beforeEach(() => {
    itemFixture = {
      date_sent_to_company: '2022-11-16T12:00:00-05:00',
      zip_code: '12345',
      tags: null,
      issue: 'Incorrect information on your report',
      product:
        'Credit reporting, credit repair services, or other personal consumer reports',
      complaint_id: '7990095',
      timely: 'Yes',
      company_response: 'In progress',
      submitted_via: 'Web',
      company: 'JP Morgan',
      date_received: '2022-11-16T12:00:00-05:00',
      state: 'FL',
      company_public_response: null,
    };
  });

  test('ComplaintCard renders with basic information', () => {
    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText('Complaint ID')).toBeInTheDocument();
    expect(screen.getByText(itemFixture.complaint_id)).toBeInTheDocument();
    expect(screen.getByText('Company name')).toBeInTheDocument();
    expect(screen.getByText(itemFixture.company)).toBeInTheDocument();
    expect(screen.queryByText('Date received')).not.toBeInTheDocument();
    expect(screen.getByText(`Consumer’s state`)).toBeInTheDocument();
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
    expect(screen.queryByText('Sub-product')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Issue' })).toBeInTheDocument();
    expect(screen.getByText(itemFixture.issue)).toBeInTheDocument();
    expect(screen.queryByText('Sub-issue')).not.toBeInTheDocument();
  });

  test('Renders sub product', () => {
    itemFixture.sub_product = 'Credit reporting';

    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText('Sub-product')).toBeInTheDocument();
    expect(screen.getByText(itemFixture.sub_product)).toBeInTheDocument();
  });

  test('Renders sub issue', () => {
    itemFixture.sub_issue = 'Public record information inaccurate';

    render(<ComplaintCard row={itemFixture} />);

    expect(screen.getByText('Sub-issue')).toBeInTheDocument();
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
