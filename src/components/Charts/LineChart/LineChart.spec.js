import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../__fixtures__/buildFluentMock';
import { LineChart } from './LineChart';
import { queryState } from '../../../reducers/query/querySlice';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { viewState } from '../../../reducers/view/viewSlice';
import { MODE_TRENDS } from '../../../constants';
import fetchMock from 'jest-fetch-mock';
import { trendsOverviewResponse } from '../../Trends/TrendsPanel/fixture';

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

  render(<LineChart />, {
    preloadedState: data,
  });
};

jest.mock('d3');
describe('component: LineChart', () => {
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

  it('should render chart with data', async () => {
    const trends = { lens: 'Overview' };
    const query = {
      dateInterval: 'Month',
      date_received_max: '2024-09-02',
      date_received_min: '2024-03-02',
    };

    const view = {
      isPrintMode: false,
      tab: MODE_TRENDS,
    };

    fetchMock.mockResponseOnce(JSON.stringify(trendsOverviewResponse));
    renderComponent(query, trends, view);
    await screen.findByText('Complaints');
    expect(screen.getByText('Complaints')).toBeInTheDocument();
    expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
  });

  it('should render with error message when no data is present', () => {
    const trends = {};
    const query = {
      dateInterval: 'Month',
      date_received_max: new Date('2024-09-02T07:00:00.000Z'),
      date_received_min: new Date('2024-03-02T08:00:00.000Z'),
      lens: 'Overview',
    };

    const view = {
      isPrintMode: false,
      tab: MODE_TRENDS,
    };
    renderComponent(query, trends, view);

    expect(
      screen.getByText(
        'Cannot display chart. Adjust your date range or date interval.',
      ),
    ).toBeInTheDocument();
  });
});
