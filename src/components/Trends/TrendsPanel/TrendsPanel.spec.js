import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../../Charts/__fixtures__/buildFluentMock';
import { defaultTrends } from '../../../reducers/trends/trends';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';
import { TrendsPanel } from './TrendsPanel';

const renderComponent = (queryState, trendsState, viewState) => {
  merge(queryState, defaultQuery);
  merge(trendsState, defaultTrends);
  merge(viewState, defaultView);

  const data = {
    query: queryState,
    trends: trendsState,
    view: viewState,
  };

  render(<TrendsPanel />, {
    preloadedState: data,
  });
};

jest.mock('d3');
describe('component::TrendsPanel', () => {
  beforeEach(() => {
    const fakeD3 = buildFluentMock({ height: 50 });
    // how we add our own implementation of d3
    // override this so it doesn't crash. we test implementation elsewhere.
    jest.spyOn(d3, 'select').mockImplementation(fakeD3);
    jest.spyOn(d3, 'selectAll').mockImplementation(fakeD3);
  });

  //NOTE: Currently running into state mutation errors with the test data, when multiple tests are present
  //TODO: Add remaining tests after migration to Redux Toolkit, so that mutable state can be accounted for
  it('should render Overview lens with no company overlay', () => {
    const query = {
      company: [],
      dateInterval: 'Month',
      date_received_min: new Date('1/1/2018'),
      date_received_max: new Date('1/1/2021'),
      lens: 'Overview',
      trendsDateWarningEnabled: false,
    };

    const trends = {
      colorMap: { Complaints: '#ADDC91', Other: '#a2a3a4' },
      results: {
        dateRangeArea: [],
        dateRangeLine: {
          dataByTopic: [
            {
              topic: 'Complaints',
              topicName: 'Complaints',
              dashed: false,
              show: true,
              dates: [
                { date: '2020-01-01T00:00:00.000Z', value: 100 },
                { date: '2020-02-01T00:00:00.000Z', value: 200 },
                { date: '2020-03-01T00:00:00.000Z', value: 150 },
                { date: '2020-04-01T00:00:00.000Z', value: 250 },
                { date: '2020-05-01T00:00:00.000Z', value: 500 },
                { date: '2020-06-01T00:00:00.000Z', value: 800 },
                { date: '2020-07-01T00:00:00.000Z', value: 600 },
                { date: '2020-08-01T00:00:00.000Z', value: 200 },
                { date: '2020-09-01T00:00:00.000Z', value: 600 },
                { date: '2020-10-01T00:00:00.000Z', value: 400 },
                { date: '2020-11-01T00:00:00.000Z', value: 300 },
                { date: '2020-12-01T00:00:00.000Z', value: 900 },
              ],
            },
          ],
        },
        issue: [{ name: 'adg', value: 123 }],
        product: [{ name: 'adg', value: 123 }],
        company: [{ name: 'adg', value: 123 }],
      },
      total: 5000,
    };

    const view = {
      expandedRows: [],
      width: 600,
    };
    renderComponent(query, trends, view);

    expect(
      screen.getByText('Complaints by date received by the CFPB'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Product by highest complaint volume 1/1/2018 to 1/1/2021',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Product the consumer identified in the complaint. Click on a product to expand sub-products',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A time series graph of complaints for the selected date range. Hover on the chart to see the count for each date interval. Your filter selections will update what you see on the graph.',
      ),
    ).toBeInTheDocument();
  });
});
