import { ComplaintDetail } from './ComplaintDetail';
import {
  testRenderWithMemoryRouter as render,
  screen,
} from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { routesState } from '../../reducers/routes/routesSlice';
import fetchMock from 'jest-fetch-mock';
import { Route, Routes } from 'react-router-dom';

const fixture = {
  took: 1,
  timed_out: false,
  _shards: { total: 5, successful: 5, skipped: 0, failed: 0 },
  hits: {
    total: { value: 1, relation: 'eq' },
    max_score: 1.0,
    hits: [
      {
        _index: 'complaint-public-v2',
        _type: '_doc',
        _id: '2371744',
        _score: 1.0,
        _source: {
          company: 'JPMORGAN CHASE & CO.',
          company_public_response: 'Company acknowledges the complaint',
          company_response: 'Closed with explanation',
          complaint_id: '2371744',
          complaint_what_happened: 'Lorem ipsum dolor sit amet',
          consumer_consent_provided: 'Consent provided',
          consumer_disputed: 'Yes',
          date_received: '2017-03-04T12:00:00',
          date_sent_to_company: '2017-03-04T12:00:00',
          has_narrative: true,
          issue: 'Account opening, closing, or management',
          product: 'Bank account or service',
          state: 'KY',
          sub_issue: 'Closing',
          sub_product: 'Checking account',
          submitted_via: 'Web',
          tags: 'Older American',
          timely: 'Yes',
          zip_code: '423XX',
        },
      },
    ],
  },
};

const renderComponent = (newRoutesState) => {
  merge(newRoutesState, routesState);
  const data = {
    routes: newRoutesState,
  };
  render(
    <Routes>
      <Route path="/detail/:id" element={<ComplaintDetail />} />
    </Routes>,
    {
      preloadedState: data,
      initialEntries: ['/detail/2371744'],
    },
  );
};

describe('component::ComplaintDetail', () => {
  let response;
  beforeEach(() => {
    fetchMock.resetMocks();
    response = structuredClone(fixture);
  });

  it('renders loading page', () => {
    renderComponent({
      params: {
        product: 'bar',
        issue: 'nope',
        tab: 'List',
      },
    });
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/?issue=nope&product=bar&tab=List',
    );
    expect(screen.getByText('This page is loading')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
  });

  it('renders error', async () => {
    fetchMock.mockResponseOnce({ foo: 'bar' });
    renderComponent({});
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/',
    );

    await screen.findByText(/There was a problem retrieving/);
    expect(
      screen.getByText(/There was a problem retrieving/),
    ).toBeInTheDocument();
  });

  it('renders document', async () => {
    const docResponse = response.hits.hits[0]._source;
    fetchMock.mockResponseOnce(JSON.stringify(response));
    renderComponent({});

    await screen.findByText(docResponse.sub_issue);
    expect(screen.getByText(docResponse.sub_issue)).toBeInTheDocument();
    expect(screen.getByText(docResponse.sub_product)).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/',
    );

    expect(
      screen.getByText('Date CFPB received the complaint'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Yes')).toHaveLength(2);
    expect(screen.getByText(docResponse.company)).toBeInTheDocument();
    expect(screen.getByText(docResponse.company_response)).toBeInTheDocument();
    expect(
      screen.getByText(docResponse.company_public_response),
    ).toBeInTheDocument();
    expect(screen.getByText(docResponse.submitted_via)).toBeInTheDocument();
  });

  it('handles missing narrative, sub-agg and timely values', async () => {
    const docResponse = response.hits.hits[0]._source;
    docResponse.complaint_what_happened = '';
    docResponse.consumer_disputed = 'No';
    docResponse.timely = '';
    docResponse.sub_issue = '';
    docResponse.sub_product = '';
    response.hits.hits[0]._source = docResponse;
    fetchMock.mockResponseOnce(JSON.stringify(response));

    renderComponent({});

    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/',
    );

    await screen.findByText(docResponse.company_public_response);

    expect(
      screen.getByText('Date CFPB received the complaint'),
    ).toBeInTheDocument();

    expect(screen.getByText(docResponse.company)).toBeInTheDocument();
    expect(screen.getByText(docResponse.company_response)).toBeInTheDocument();
    expect(
      screen.getByText(docResponse.company_public_response),
    ).toBeInTheDocument();
    expect(screen.getByText(docResponse.consumer_disputed)).toBeInTheDocument();
    expect(screen.getByText(docResponse.submitted_via)).toBeInTheDocument();
    expect(screen.queryByText('Sub-product:')).not.toBeInTheDocument();
    expect(screen.queryByText('Sub-issue:')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Consumer complaint narrative'),
    ).not.toBeInTheDocument();
  });

  it('handles errors with "Consumer Consent Provided" icons', async () => {
    const dataFixture = response.hits.hits[0]._source;
    dataFixture.complaint_what_happened = '';
    dataFixture.consumer_consent_provided = 'Bad Value';
    response.hits.hits[0]._source = dataFixture;
    fetchMock.mockResponseOnce(JSON.stringify(response));
    renderComponent({});
    await screen.findByText('Date CFPB received the complaint');
    expect(
      screen.getByText('Date CFPB received the complaint'),
    ).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('Not Timely', async () => {
    const dataFixture = response.hits.hits[0]._source;
    dataFixture.timely = 'No';
    response.hits.hits[0]._source = dataFixture;
    fetchMock.mockResponseOnce(JSON.stringify(response));
    renderComponent({});
    await screen.findByText(/Timely response/);
    expect(screen.getByText('Timely response?')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
});
