import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../../Charts/__fixtures__/buildFluentMock';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { queryState } from '../../../reducers/query/querySlice';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { viewState } from '../../../reducers/view/viewSlice';
import { TrendsPanel } from './TrendsPanel';

const renderComponent = (
  newFiltersState,
  newQueryState,
  newTrendsState,
  newViewState,
) => {
  merge(newFiltersState, filtersState);
  merge(newQueryState, queryState);
  merge(newTrendsState, trendsState);
  merge(newViewState, viewState);

  const data = {
    filters: newFiltersState,
    query: newQueryState,
    trends: newTrendsState,
    view: newViewState,
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

  it('should render Overview lens with no company overlay', () => {
    const filters = {
      company: [],
    };
    const query = {
      dateInterval: 'Month',
      date_received_min: new Date('1/1/2018'),
      date_received_max: new Date('1/1/2021'),
      trendsDateWarningEnabled: false,
    };

    const trends = {
      activeCall: '',
      chartType: 'line',
      colorMap: { Complaints: '#ADDC91', Other: '#a2a3a4' },
      focus: '',
      lens: 'Overview',
      subLens: '',
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
    renderComponent(filters, query, trends, view);

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

  it('should render Focus pages', () => {
    const filters = {
      company: ['CITIBANK, N.A.'],
      company_public_response: [],
      company_received_max: '',
      company_received_min: '',
      company_response: [],
      consumer_consent_provided: [],
      consumer_disputed: [],
      dataNormalization: 'None',
      enablePer1000: false,
      issue: [],
      mapWarningEnabled: true,
      product: [],
      state: [],
      submitted_via: [],
      tags: [],
      timely: [],
      zip_code: [],
    };
    const query = {
      breakPoints: {},
      dateInterval: 'Quarter',
      dateRange: '1y',
      date_received_max: '2024-10-07',
      date_received_min: '2023-10-07',
      from: 0,
      page: 1,
      searchAfter: '',
      searchField: 'all',
      searchText: '',
      size: 25,
      sort: 'created_date_desc',
      totalPages: 0,
      trendsDateWarningEnabled: false,
    };

    const trends = {
      chartType: 'area',
      focus: 'CITIBANK, N.A.',
      lens: 'Company',
      subLens: 'product',
      trendDepth: 5,
      activeCall: '',
      colorMap: {
        'Credit card': '#2cb34a',
        'Credit reporting or other personal consumer reports': '#addc91',
        'Checking or savings account': '#0072ce',
        'Debt collection': '#96c4ed',
        'Money transfer, virtual currency, or money service': '#257675',
        Complaints: '#20aa3f',
        Other: '#a2a3a4',
        'All other products': '#a2a3a4',
        'All other companies': '#a2a3a4',
        'All other values': '#a2a3a4',
      },
      error: false,
      results: {
        dateRangeArea: [
          { name: 'Other', value: 27, date: '2023-10-01T00:00:00.000Z' },
          { name: 'Other', value: 27, date: '2024-01-01T00:00:00.000Z' },
          { name: 'Other', value: 38, date: '2024-04-01T00:00:00.000Z' },
          { name: 'Other', value: 36, date: '2024-07-01T00:00:00.000Z' },
          { name: 'Other', value: 1, date: '2024-10-01T00:00:00.000Z' },
          {
            name: 'Credit card',
            value: 1198,
            date: '2023-10-01T00:00:00.000Z',
          },
          {
            name: 'Credit card',
            value: 1446,
            date: '2024-01-01T00:00:00.000Z',
          },
          {
            name: 'Credit card',
            value: 1717,
            date: '2024-04-01T00:00:00.000Z',
          },
          {
            name: 'Credit card',
            value: 1647,
            date: '2024-07-01T00:00:00.000Z',
          },
          { name: 'Credit card', value: 12, date: '2024-10-01T00:00:00.000Z' },
          {
            name: 'Credit reporting or other personal consumer reports',
            value: 460,
            date: '2023-10-01T00:00:00.000Z',
          },
          {
            name: 'Credit reporting or other personal consumer reports',
            value: 527,
            date: '2024-01-01T00:00:00.000Z',
          },
          {
            name: 'Credit reporting or other personal consumer reports',
            value: 862,
            date: '2024-04-01T00:00:00.000Z',
          },
          {
            name: 'Credit reporting or other personal consumer reports',
            value: 988,
            date: '2024-07-01T00:00:00.000Z',
          },
          {
            name: 'Credit reporting or other personal consumer reports',
            value: 8,
            date: '2024-10-01T00:00:00.000Z',
          },
          {
            name: 'Checking or savings account',
            value: 463,
            date: '2023-10-01T00:00:00.000Z',
          },
          {
            name: 'Checking or savings account',
            value: 561,
            date: '2024-01-01T00:00:00.000Z',
          },
          {
            name: 'Checking or savings account',
            value: 763,
            date: '2024-04-01T00:00:00.000Z',
          },
          {
            name: 'Checking or savings account',
            value: 703,
            date: '2024-07-01T00:00:00.000Z',
          },
          {
            name: 'Checking or savings account',
            value: 2,
            date: '2024-10-01T00:00:00.000Z',
          },
          {
            name: 'Debt collection',
            value: 95,
            date: '2023-10-01T00:00:00.000Z',
          },
          {
            name: 'Debt collection',
            value: 148,
            date: '2024-01-01T00:00:00.000Z',
          },
          {
            name: 'Debt collection',
            value: 215,
            date: '2024-04-01T00:00:00.000Z',
          },
          {
            name: 'Debt collection',
            value: 240,
            date: '2024-07-01T00:00:00.000Z',
          },
          {
            name: 'Debt collection',
            value: 2,
            date: '2024-10-01T00:00:00.000Z',
          },
          {
            name: 'Money transfer, virtual currency, or money service',
            value: 67,
            date: '2023-10-01T00:00:00.000Z',
          },
          {
            name: 'Money transfer, virtual currency, or money service',
            value: 80,
            date: '2024-01-01T00:00:00.000Z',
          },
          {
            name: 'Money transfer, virtual currency, or money service',
            value: 95,
            date: '2024-04-01T00:00:00.000Z',
          },
          {
            name: 'Money transfer, virtual currency, or money service',
            value: 85,
            date: '2024-07-01T00:00:00.000Z',
          },
          {
            name: 'Money transfer, virtual currency, or money service',
            value: 1,
            date: '2024-10-01T00:00:00.000Z',
          },
        ],
        dateRangeLine: {
          dataByTopic: [
            {
              topic: 'Credit card',
              topicName: 'Credit card',
              dashed: false,
              show: true,
              dates: [
                {
                  name: 'Credit card',
                  date: '2023-10-01T00:00:00.000Z',
                  value: 1198,
                },
                {
                  name: 'Credit card',
                  date: '2024-01-01T00:00:00.000Z',
                  value: 1446,
                },
                {
                  name: 'Credit card',
                  date: '2024-04-01T00:00:00.000Z',
                  value: 1717,
                },
                {
                  name: 'Credit card',
                  date: '2024-07-01T00:00:00.000Z',
                  value: 1647,
                },
                {
                  name: 'Credit card',
                  date: '2024-10-01T00:00:00.000Z',
                  value: 12,
                },
              ],
            },
            {
              topic: 'Credit reporting or other personal consumer reports',
              topicName: 'Credit reporting or other personal consumer reports',
              dashed: false,
              show: true,
              dates: [
                {
                  name: 'Credit reporting or other personal consumer reports',
                  date: '2023-10-01T00:00:00.000Z',
                  value: 460,
                },
                {
                  name: 'Credit reporting or other personal consumer reports',
                  date: '2024-01-01T00:00:00.000Z',
                  value: 527,
                },
                {
                  name: 'Credit reporting or other personal consumer reports',
                  date: '2024-04-01T00:00:00.000Z',
                  value: 862,
                },
                {
                  name: 'Credit reporting or other personal consumer reports',
                  date: '2024-07-01T00:00:00.000Z',
                  value: 988,
                },
                {
                  name: 'Credit reporting or other personal consumer reports',
                  date: '2024-10-01T00:00:00.000Z',
                  value: 8,
                },
              ],
            },
            {
              topic: 'Checking or savings account',
              topicName: 'Checking or savings account',
              dashed: false,
              show: true,
              dates: [
                {
                  name: 'Checking or savings account',
                  date: '2023-10-01T00:00:00.000Z',
                  value: 463,
                },
                {
                  name: 'Checking or savings account',
                  date: '2024-01-01T00:00:00.000Z',
                  value: 561,
                },
                {
                  name: 'Checking or savings account',
                  date: '2024-04-01T00:00:00.000Z',
                  value: 763,
                },
                {
                  name: 'Checking or savings account',
                  date: '2024-07-01T00:00:00.000Z',
                  value: 703,
                },
                {
                  name: 'Checking or savings account',
                  date: '2024-10-01T00:00:00.000Z',
                  value: 2,
                },
              ],
            },
            {
              topic: 'Debt collection',
              topicName: 'Debt collection',
              dashed: false,
              show: true,
              dates: [
                {
                  name: 'Debt collection',
                  date: '2023-10-01T00:00:00.000Z',
                  value: 95,
                },
                {
                  name: 'Debt collection',
                  date: '2024-01-01T00:00:00.000Z',
                  value: 148,
                },
                {
                  name: 'Debt collection',
                  date: '2024-04-01T00:00:00.000Z',
                  value: 215,
                },
                {
                  name: 'Debt collection',
                  date: '2024-07-01T00:00:00.000Z',
                  value: 240,
                },
                {
                  name: 'Debt collection',
                  date: '2024-10-01T00:00:00.000Z',
                  value: 2,
                },
              ],
            },
            {
              topic: 'Money transfer, virtual currency, or money service',
              topicName: 'Money transfer, virtual currency, or money service',
              dashed: false,
              show: true,
              dates: [
                {
                  name: 'Money transfer, virtual currency, or money service',
                  date: '2023-10-01T00:00:00.000Z',
                  value: 67,
                },
                {
                  name: 'Money transfer, virtual currency, or money service',
                  date: '2024-01-01T00:00:00.000Z',
                  value: 80,
                },
                {
                  name: 'Money transfer, virtual currency, or money service',
                  date: '2024-04-01T00:00:00.000Z',
                  value: 95,
                },
                {
                  name: 'Money transfer, virtual currency, or money service',
                  date: '2024-07-01T00:00:00.000Z',
                  value: 85,
                },
                {
                  name: 'Money transfer, virtual currency, or money service',
                  date: '2024-10-01T00:00:00.000Z',
                  value: 1,
                },
              ],
            },
          ],
        },
        product: [
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Credit card',
            value: 6020,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Credit reporting or other personal consumer reports',
            value: 2845,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Checking or savings account',
            value: 2492,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Debt collection',
            value: 700,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Money transfer, virtual currency, or money service',
            value: 328,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Payday loan, title loan, personal loan, or advance loan',
            value: 48,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Mortgage',
            value: 40,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Prepaid card',
            value: 20,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Debt or credit management',
            value: 8,
            parent: false,
            width: 0.5,
          },
          {
            hasChildren: false,
            isNotFilter: false,
            isParent: true,
            name: 'Vehicle loan or lease',
            value: 7,
            parent: false,
            width: 0.5,
          },
        ],
      },
      tooltip: {
        key: '2024-07-01T00:00:00.000Z',
        date: '2024-07-01T00:00:00.000Z',
        dateRange: { from: '2023-10-07', to: '2024-10-07' },
        interval: 'Quarter',
        values: [
          {
            name: 'Other',
            value: 36,
            date: '2024-07-01T00:00:00.000Z',
            colorIndex: 10,
          },
          {
            name: 'Credit card',
            value: 1647,
            date: '2024-07-01T00:00:00.000Z',
            colorIndex: 0,
          },
          {
            name: 'Credit reporting or other personal consumer reports',
            value: 988,
            date: '2024-07-01T00:00:00.000Z',
            colorIndex: 1,
          },
          {
            name: 'Checking or savings account',
            value: 703,
            date: '2024-07-01T00:00:00.000Z',
            colorIndex: 2,
          },
          {
            name: 'Debt collection',
            value: 240,
            date: '2024-07-01T00:00:00.000Z',
            colorIndex: 3,
          },
          {
            name: 'Money transfer, virtual currency, or money service',
            value: 85,
            date: '2024-07-01T00:00:00.000Z',
            colorIndex: 4,
          },
        ],
        title: 'Date range: 6/30/2024 - 9/29/2024',
        total: 3699,
      },
      total: 12514,
    };
    const view = {
      expandedRows: [],
      isPrintMode: false,
      hasAdvancedSearchTips: false,
      hasFilters: true,
      modalTypeShown: false,
      showTour: false,
      tab: 'Trends',
      width: 1508,
    };

    renderComponent(filters, query, trends, view);

    expect(screen.getByText('CITIBANK, N.A.')).toBeInTheDocument();
    expect(
      screen.getByText('Complaints by products, by date received by the CFPB'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Product the consumer identified in the complaint'),
    ).toBeInTheDocument();
  });
});
