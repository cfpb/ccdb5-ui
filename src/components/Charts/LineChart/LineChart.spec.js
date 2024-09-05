import { testRender as render, screen } from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { LineChart } from './LineChart';
import { defaultTrends } from '../../../reducers/trends/trends';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';

import * as d3 from 'd3';
import buildFluentMock from '../__fixtures__/buildFluentMock';

jest.mock('d3');

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

describe('component: LineChart', () => {
  //let updateTrendsTooltipFn;

  beforeEach(() => {
    jest.resetAllMocks();
    //updateTrendsTooltipFn = jest.spy(trendsActions, 'updateTrendsTooltip');
    const fakeD3 = buildFluentMock({ height: 50 });
    // how we add our own implementation of d3
    jest.spyOn(d3, 'select').mockImplementation(fakeD3);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render Overview chart with data', () => {
    const newTrendsState = {
      colorMap: {
        Complaints: '#20aa3f',
        Other: '#a2a3a4',
        'All other products': '#a2a3a4',
        'All other companies': '#a2a3a4',
        'All other values': '#a2a3a4',
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
    const newQueryState = {
      dateInterval: 'Month',
      date_received_max: new Date('2024-09-02T07:00:00.000Z'),
      date_received_min: new Date('2024-03-02T08:00:00.000Z'),
      lens: 'Overview',
    };

    renderComponent(newQueryState, newTrendsState, {});
    expect(screen.getByText('Complaints')).toBeInTheDocument();
    expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();

    // TODO: the chart is currently mocked. If we can get jsdom or something
    //  to work, we can actually check
    //  - the chart element renders
    //  - mouseover works
  });
});
