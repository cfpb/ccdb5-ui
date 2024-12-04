import { testRender as render, screen } from '../../testUtils/test-utils';
import { StaleDataWarnings } from './StaleDataWarnings';
import { resAggWarning } from './fixture';
import fetchMock from 'jest-fetch-mock';

describe('StaleDataWarnings', () => {
  const renderComponent = () => {
    const data = {
      routes: { queryString: '?fdsfds' },
    };

    render(<StaleDataWarnings />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });
  test('data issue warning', async () => {
    const dataWarning = {
      ...resAggWarning,
    };
    dataWarning._meta.has_data_issue = true;
    fetchMock.mockResponseOnce(JSON.stringify(dataWarning));
    renderComponent();

    await screen.findByText(/We’re currently experiencing technical/);
    expect(
      screen.getByText(
        /We’re currently experiencing technical issues that have delayed the refresh of data on the Consumer Complaint Database./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We expect to refresh the data in the next few days./),
    ).toBeInTheDocument();
  });

  test('stale data warning', async () => {
    const dataWarning = {
      ...resAggWarning,
    };
    dataWarning._meta.is_data_stale = true;
    fetchMock.mockResponseOnce(JSON.stringify(dataWarning));
    renderComponent();

    await screen.findByText(/We’re currently experiencing technical/);
    expect(
      screen.getByText(
        /We’re currently experiencing technical issues that have delayed the refresh of data on the Consumer Complaint Database./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We expect to refresh the data in the next few days./),
    ).toBeInTheDocument();
  });
  test('both data issues', async () => {
    const dataWarning = {
      ...resAggWarning,
    };
    dataWarning._meta.has_data_issue = true;
    dataWarning._meta.is_data_stale = true;

    fetchMock.mockResponseOnce(JSON.stringify(dataWarning));

    renderComponent();
    await screen.findByText(/We’re currently experiencing technical/);
    expect(
      screen.getByText(
        /We’re currently experiencing technical issues that have delayed the refresh of data on the Consumer Complaint Database./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We expect to refresh the data in the next few days./),
    ).toBeInTheDocument();
  });

  test('no issues', () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        _meta: {
          is_data_stale: false,
          has_data_issue: false,
        },
      }),
    );
    renderComponent();
    expect(
      screen.queryByText(/We expect to refresh the data in the next few days./),
    ).not.toBeInTheDocument();
  });
});
