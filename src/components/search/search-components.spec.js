import { render, screen } from '@testing-library/react';
import { DSRProvider } from '@cfpb/design-system-react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { SearchComponents } from './search-components';
import { DsrLink } from '../dsr-link/dsr-link';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../list/list-panel/fixture';
import { configureStoreUtil } from '../../test-utils/test-utils';

describe('SearchComponents', () => {
  let store;
  beforeEach(() => {
    fetchMock.resetMocks();
    store = configureStoreUtil({ routes: { queryString: '??Fdsfdssdf' } });
  });

  it('renders the search container', async () => {
    fetchMock.mockResponse((req) => {
      const url = new URL(req.url);
      const params = url.searchParams;

      if (params.get('size') === '0') {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
      return Promise.resolve({
        body: JSON.stringify(aggResponse),
      });
    });
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <DSRProvider LinkComponent={DsrLink}>
            <Routes>
              <Route path="/" element={<SearchComponents />} />
            </Routes>
          </DSRProvider>
        </Provider>
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: /Search complaint data/ });
    expect(
      screen.getByRole('heading', { name: /Search complaint data/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Skip to Results/i }),
    ).toBeInTheDocument();
  });
});
