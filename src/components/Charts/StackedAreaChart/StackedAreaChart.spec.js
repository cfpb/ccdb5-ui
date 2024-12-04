import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../__fixtures__/buildFluentMock';
import { StackedAreaChart } from './StackedAreaChart';
import { queryState } from '../../../reducers/query/querySlice';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { viewState } from '../../../reducers/view/viewSlice';
import fetchMock from 'jest-fetch-mock';
import { stackedAreaOverviewResponse } from './fixture';
import { MODE_TRENDS } from '../../../constants';

const renderComponent = (newQueryState, newTrendsState, newViewState) => {
  merge(newQueryState, queryState);
  merge(newTrendsState, trendsState);
  merge(newViewState, viewState);

  const data = {
    query: newQueryState,
    routes: { queryString: 'fdsdfs' },
    trends: newTrendsState,
    view: newViewState,
  };

  render(<StackedAreaChart />, {
    preloadedState: data,
  });
};

jest.mock('d3');
describe('component::StackedAreaChart', () => {
  beforeEach(() => {
    const fakeD3 = buildFluentMock({ height: 50 });
    // how we add our own implementation of d3
    // override this so it doesn't crash. we test implementation elsewhere.
    jest.spyOn(d3, 'select').mockImplementation(fakeD3);
    jest.spyOn(d3, 'selectAll').mockImplementation(fakeD3);
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render chart with data as expected', async () => {
    const trends = {
      chartType: 'area',
      lens: 'Product',
      tooltip: false,
    };

    const query = {
      dateInterval: 'Month',
      date_received_max: '2024-01-02',
      date_received_min: '2024-12-02',
    };

    const view = {
      isPrintMode: false,
      tab: MODE_TRENDS,
      width: 1000,
    };
    fetchMock.mockResponseOnce(JSON.stringify(stackedAreaOverviewResponse));
    renderComponent(query, trends, view);
    await screen.findByText('Complaints');
    expect(screen.getByText('Complaints')).toBeInTheDocument();
    expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
  });
});
