import { testRender as render, screen } from '../../testUtils/test-utils';
import { StaleDataWarnings } from './StaleDataWarnings';
import { merge } from '../../testUtils/functionHelpers';
import { defaultAggs } from '../../reducers/aggs/aggs';

describe('StaleDataWarnings', () => {
  const renderComponent = (newAggsState) => {
    merge(newAggsState, defaultAggs);
    const data = {
      aggs: newAggsState,
    };

    render(<StaleDataWarnings />, {
      preloadedState: data,
    });
  };
  test('data issue warning', () => {
    renderComponent({
      hasDataIssue: true,
      isDataStale: false,
    });

    expect(
      screen.getByText(
        /We’re currently experiencing technical issues that have delayed the refresh of data on the Consumer Complaint Database./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We expect to refresh the data in the next few days./),
    ).toBeInTheDocument();
  });

  test('stale data warning', () => {
    renderComponent({
      hasDataIssue: false,
      isDataStale: true,
    });

    expect(
      screen.getByText(
        /We’re currently experiencing technical issues that have delayed the refresh of data on the Consumer Complaint Database./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We expect to refresh the data in the next few days./),
    ).toBeInTheDocument();
  });
  test('both data issues', () => {
    renderComponent({
      hasDataIssue: true,
      isDataStale: true,
    });

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
    renderComponent({});
    expect(
      screen.queryByText(/We expect to refresh the data in the next few days./),
    ).toBeNull();
  });
});
