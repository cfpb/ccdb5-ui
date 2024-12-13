import { PrintInfo } from './PrintInfo';
import { queryState } from '../../reducers/query/querySlice';
import { viewState } from '../../reducers/view/viewSlice';
import { merge } from '../../testUtils/functionHelpers';
import { testRender as render, screen } from '../../testUtils/test-utils';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../List/ListPanel/fixture';

describe('PrintInfo', () => {
  const renderComponent = (newQueryState, newViewState) => {
    merge(newQueryState, queryState);
    merge(newViewState, viewState);

    const data = {
      query: newQueryState,
      routes: { queryString: '?asddsa' },
      view: newViewState,
    };
    render(<PrintInfo />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders default state', () => {
    renderComponent({}, {});
    expect(screen.queryByText('Dates:')).not.toBeInTheDocument();
    expect(screen.queryByText('5/5/2017 - 5/5/2020')).not.toBeInTheDocument();
  });

  it('renders filtered complaints', async () => {
    const newQuery = {
      date_received_max: '2020-03-05T05:00:00.000Z',
      date_received_min: '2017-03-05T05:00:00.000Z',
      searchText: 'foobar',
    };

    const newView = {
      isPrintMode: true,
    };
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent(newQuery, newView);
    await screen.findByText('4,303,365');
    expect(screen.getByText('Dates:')).toBeInTheDocument();
    expect(screen.getByText('3/5/2017 - 3/5/2020')).toBeInTheDocument();
    expect(screen.getByText('foobar')).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText('4,303,365')).toBeInTheDocument();
    expect(screen.getByText(/out of/)).toBeInTheDocument();
    expect(screen.getByText('6,638,372')).toBeInTheDocument();
    expect(screen.getByText(/total complaints/)).toBeInTheDocument();
  });
});
