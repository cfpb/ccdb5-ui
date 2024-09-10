import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../__fixtures__/buildFluentMock';
import { StackedAreaChart } from './StackedAreaChart';
import { queryState } from '../../../reducers/query/querySlice';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { viewState } from '../../../reducers/view/viewSlice';

const renderComponent = (newQueryState, newTrendsState, newViewState) => {
  merge(newQueryState, queryState);
  merge(newTrendsState, trendsState);
  merge(newViewState, viewState);

  const data = {
    query: newQueryState,
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render chart with data as expected', () => {
    const trends = {
      colorMap: {
        Other: '#345',
        foo: '#fff',
        bar: '#eee',
      },
      lens: 'Overview',
      results: {
        dateRangeArea: [
          { date: '2024-05-01T00:00:00.000Z', value: 225171, name: 'Other' },
          { date: '2024-06-01T00:00:00.000Z', value: 225171, name: 'Other' },
          { date: '2024-07-01T00:00:00.000Z', value: 225171, name: 'Other' },
          { date: '2024-08-01T00:00:00.000Z', value: 198483, name: 'Other' },
        ],
      },
      tooltip: false,
    };

    const query = {
      dateInterval: 'Month',
      date_received_max: new Date('2024-01-02T07:00:00.000Z'),
      date_received_min: new Date('2024-12-02T08:00:00.000Z'),
    };

    const view = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(query, trends, view);

    expect(screen.getByText('Complaints')).toBeInTheDocument();
    expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
  });
});
