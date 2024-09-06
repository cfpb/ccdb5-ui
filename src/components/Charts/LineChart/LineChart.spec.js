import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../__fixtures__/buildFluentMock';
import { LineChart } from './LineChart';
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render chart with data', async () => {
    const trends = {
      colorMap: {
        Complaints: '#20aa3f',
        Other: '#a2a3a4',
      },
      results: {
        dateRangeLine: {
          dataByTopic: [
            {
              topic: 'Complaints',
              topicName: 'Complaints',
              dashed: false,
              show: true,
              dates: [
                { date: '2024-05-01T00:00:00.000Z', value: 225171 },
                { date: '2024-06-01T00:00:00.000Z', value: 225171 },
                { date: '2024-07-01T00:00:00.000Z', value: 225171 },
                { date: '2024-08-01T00:00:00.000Z', value: 198483 },
              ],
            },
          ],
        },
      },
    };
    const query = {
      dateInterval: 'Month',
      date_received_max: new Date('2024-09-02T07:00:00.000Z'),
      date_received_min: new Date('2024-03-02T08:00:00.000Z'),
      lens: 'Overview',
    };

    const view = {};

    renderComponent(query, trends, view);

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
    };
    renderComponent(query, trends, view);

    expect(
      screen.getByText(
        'Cannot display chart. Adjust your date range or date interval.',
      ),
    ).toBeInTheDocument();
  });
});
