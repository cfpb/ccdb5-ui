import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SearchComponents } from './SearchComponents';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../List/ListPanel/fixture';
import { trendsResponse } from '../Trends/fixture';
import { configureStoreUtil } from '../../testUtils/test-utils';

describe('SearchComponents', () => {
  let store;
  beforeEach(() => {
    fetchMock.resetMocks();
    store = configureStoreUtil({ routes: { queryString: '??Fdsfdssdf' } });
  });

  it('renders the search container', () => {
    fetchMock.mockResponse((req) => {
      const url = new URL(req.url);
      const params = url.searchParams;

      if (params.get('size') === '0') {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      } else if (params.get('no_aggs')) {
        return Promise.resolve({
          body: JSON.stringify(trendsResponse),
        });
      }
    });
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<SearchComponents />} />
          </Routes>
        </Provider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /Search complaint data/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Skip to Results/i }),
    ).toBeInTheDocument();
  });
});
