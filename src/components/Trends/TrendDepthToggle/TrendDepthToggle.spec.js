import { TrendDepthToggle } from './TrendDepthToggle';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import * as trendsActions from '../../../reducers/trends/trendsSlice';
import fetchMock from 'jest-fetch-mock';
import { MODE_TRENDS } from '../../../constants';
import {
  aggResponse,
  trendsResponse,
  trendsResponseCompany,
  trendsResponseCompanyDepth7,
  trendsResponseDepth14,
} from '../fixture';
import { queryState } from '../../../reducers/query/querySlice';

const renderComponent = (newFiltersState, newTrendsState) => {
  merge(newFiltersState, filtersState);
  merge(newTrendsState, trendsState);
  const data = {
    filters: newFiltersState,
    query: queryState,
    routes: { queryString: '?fdsafsfoo' },
    trends: newTrendsState,
    view: { tab: MODE_TRENDS },
  };
  render(<TrendDepthToggle />, { preloadedState: data });
};

describe('component:TrendDepthToggle', () => {
  let depthChangedSpy, depthResetSpy;
  beforeEach(() => {
    fetchMock.resetMocks();

    depthChangedSpy = jest
      .spyOn(trendsActions, 'depthChanged')
      .mockImplementation(() => jest.fn());
    depthResetSpy = jest
      .spyOn(trendsActions, 'depthReset')
      .mockImplementation(() => jest.fn());
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('does not render on Focus page', () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsResponse),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });
    renderComponent({}, { focus: 'Foo bar' });
    expect(
      screen.queryByRole('button', { name: 'Show more' }),
    ).not.toBeInTheDocument();
  });

  it('does not render when lens is Overview', () => {
    renderComponent({}, { lens: 'Overview' });
    expect(
      screen.queryByRole('button', { name: 'Show more' }),
    ).not.toBeInTheDocument();
  });

  it('renders Product view more link', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsResponse),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });

    renderComponent({}, {});

    await screen.findByRole('button', { name: 'Show more' });
    expect(
      screen.getByRole('button', { name: 'Show more' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(depthChangedSpy).toHaveBeenCalledWith(14);
  });

  it('renders Product show less link', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsResponseDepth14),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });
    renderComponent(
      {},
      {
        lens: 'Product',
        trendDepth: 14,
      },
    );

    await screen.findByRole('button', { name: 'Show less' });
    expect(
      screen.getByRole('button', { name: 'Show less' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show less' }));
    expect(depthResetSpy).toHaveBeenCalled();
  });

  it('renders Company view more link', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsResponseCompany),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });
    renderComponent(
      { company: ['a', 'b', 'c', 'd', 'e', 'f'] },
      { lens: 'Company' },
    );

    await screen.findByRole('button', { name: 'Show more' });
    expect(
      screen.getByRole('button', { name: 'Show more' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(depthChangedSpy).toHaveBeenCalledWith(11);
  });

  it('renders Company view less link', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsResponseCompanyDepth7),
        });
      } else if (req.url.indexOf('API?') > -1) {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });
    renderComponent(
      {
        company: [
          'CAPITAL ONE FINANCIAL CORPORATION',
          'BANK OF AMERICA, NATIONAL ASSOCIATION',
          'CITIBANK, N.A.',
          'SYNCHRONY FINANCIAL',
          'GOLDMAN SACHS BANK USA',
          'Bridgecrest Acceptance Corporation',
          'PENNYMAC LOAN SERVICES, LLC.',
        ],
      },
      {
        lens: 'Company',
        trendDepth: 7,
      },
    );
    await screen.findByRole('button', { name: 'Show less' });
    expect(
      screen.getByRole('button', { name: 'Show less' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show less' }));
    expect(depthResetSpy).toHaveBeenCalled();
  });
});
