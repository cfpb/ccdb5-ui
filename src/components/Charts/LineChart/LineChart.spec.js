import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../__fixtures__/buildFluentMock';
import { LineChart } from './LineChart';
import { defaultTrends } from '../../../reducers/trends/trends';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';

const renderComponent = (queryState, trendsState, viewState) => {
  merge(queryState, defaultQuery);
  merge(trendsState, defaultTrends);
  merge(viewState, defaultView);

  const data = {
    query: queryState,
    trends: trendsState,
    view: viewState,
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

  it('should render Overview chart with data', async () => {
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

  it('should render non-Overview chart in print mode', () => {
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
      lens: 'Foo',
    };

    const view = {
      isPrintMode: true,
    };

    renderComponent(query, trends, view);

    expect(screen.getByText('Complaints')).toBeInTheDocument();
    expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
  });

  it('should render non-Overview chart not in print mode', () => {
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
      lens: 'Foo',
    };

    const view = {
      isPrintMode: false,
    };

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
