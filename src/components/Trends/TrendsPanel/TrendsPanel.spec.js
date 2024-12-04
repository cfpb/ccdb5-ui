import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { merge } from '../../../testUtils/functionHelpers';
import { buildFluentMock } from '../../Charts/__fixtures__/buildFluentMock';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { queryState } from '../../../reducers/query/querySlice';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { viewState } from '../../../reducers/view/viewSlice';
import { TrendsPanel } from './TrendsPanel';
import fetchMock from 'jest-fetch-mock';
import {
  trendsCompanyFocusResponse,
  trendsOverviewResponse,
  trendsProductResponse,
} from './fixture';
import { MODE_TRENDS } from '../../../constants';
import { aggResponse } from '../../List/ListPanel/fixture';

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
    routes: { queryString: '?sdfds=sdfsfds' },
    trends: newTrendsState,
    view: newViewState,
  };

  render(<TrendsPanel />, {
    preloadedState: data,
  });
};

jest.mock('d3');
describe('component::TrendsPanel', () => {
  let query, view;
  beforeEach(() => {
    const fakeD3 = buildFluentMock({ height: 50 });
    // how we add our own implementation of d3
    // override this so it doesn't crash. we test implementation elsewhere.
    jest.spyOn(d3, 'select').mockImplementation(fakeD3);
    jest.spyOn(d3, 'selectAll').mockImplementation(fakeD3);
    fetchMock.resetMocks();
    query = {
      dateInterval: 'Month',
      date_received_min: '2018-01-01',
      date_received_max: '2021/01/01',
      trendsDateWarningEnabled: false,
    };
    view = {
      expandedRows: [],
      tab: MODE_TRENDS,
      width: 600,
    };
  });

  it('renders Company overlay', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify({}),
        });
      }
    });
    const filters = {
      company: [],
    };

    const trends = {
      chartType: 'line',
      focus: '',
      lens: 'Company',
      subLens: '',
    };

    renderComponent(filters, query, trends, view);

    await screen.findByText(
      /Choose a company to start your visualization using the type-ahead menu below. You can add more than one company to your view/,
    );
    expect(
      screen.getByText(
        /Choose a company to start your visualization using the type-ahead menu below. You can add more than one company to your view/,
      ),
    ).toBeInTheDocument();
  });

  it('renders Overview lens with no company overlay', async () => {
    const filters = {
      company: [],
    };
    const query = {
      dateInterval: 'Month',
      date_received_min: '2018-01-01',
      date_received_max: '2021/01/01',
      trendsDateWarningEnabled: false,
    };

    const trends = {
      chartType: 'line',
      focus: '',
      lens: 'Overview',
      subLens: '',
    };

    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsOverviewResponse),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });

    renderComponent(filters, query, trends, view);

    await screen.findByText('Complaints by date received by the CFPB');
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

  it('renders Focus pages', async () => {
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

    view = {
      expandedRows: [],
      isPrintMode: false,
      hasAdvancedSearchTips: false,
      hasFilters: true,
      modalTypeShown: false,
      showTour: false,
      tab: MODE_TRENDS,
      width: 1508,
    };

    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsCompanyFocusResponse),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });

    renderComponent(filters, query, trends, view);
    await screen.findByText(
      'Complaints by products, by date received by the CFPB',
    );
    expect(screen.getByText('CITIBANK, N.A.')).toBeInTheDocument();
    expect(
      screen.getByText('Complaints by products, by date received by the CFPB'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Product the consumer identified in the complaint'),
    ).toBeInTheDocument();
  });

  it('renders Product lens pages', async () => {
    const filters = {
      company: [],
    };
    const query = {
      dateInterval: 'Month',
      date_received_min: '2018-01-01',
      date_received_max: '2021/01/01',
      trendsDateWarningEnabled: false,
    };

    const trends = {
      chartType: 'line',
      focus: '',
      lens: 'Product',
      subLens: 'sub_product',
    };

    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsProductResponse),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });
    renderComponent(filters, query, trends, view);
    await screen.findByText('Complaints by date received by the CFPB');
    expect(
      screen.getByText('Complaints by date received by the CFPB'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Product and sub-product the consumer identified in the complaint. Click on a product to expand sub-products./,
      ),
    ).toBeInTheDocument();
  });
});
