import App from './app';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen } from '@testing-library/react';
import * as useUpdateLocationHook from './hooks/use-update-location';
import { ComplaintDetail } from './components/complaint-detail/complaint-detail';
import { configureStoreUtil, waitFor } from './test-utils/test-utils';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from './components/list/list-panel/fixture';
import { trendsResponse } from './components/trends/fixture';

jest.mock('highcharts/modules/accessibility');
jest.mock('highcharts/highmaps');

describe('initial state', () => {
  let store;
  beforeEach(() => {
    fetchMock.resetMocks();
    store = configureStoreUtil({ routes: { queryString: '??Fdsfdssdf' } });
  });

  it('renders search page', async () => {
    fetchMock.mockResponse((req) => {
      const url = new URL(req.url);
      const params = url.searchParams;

      if (params.get('size') === '0') {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
      if (params.get('no_aggs')) {
        return Promise.resolve({
          body: JSON.stringify(trendsResponse),
        });
      }
    });
    const updateLocationHookSpy = jest.spyOn(
      useUpdateLocationHook,
      'useUpdateLocation',
    );
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await screen.findByText(/Search within/);
    expect(updateLocationHookSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Consumer Complaint Database/)).toBeInTheDocument();
    expect(screen.getByText(/Search within/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Show advanced search tips/ }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Take a tour/ }),
      ).toBeInTheDocument();
    });
  }, 10000);

  it('renders the detail route', () => {
    render(
      <MemoryRouter initialEntries={['/detail/6026335']}>
        <Provider store={store}>
          <Routes>
            <Route path="/detail/:id" element={<ComplaintDetail />} />
          </Routes>
        </Provider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', { name: /Back to search results/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Back to search results/ }),
    ).toHaveAttribute('href', '/');

    expect(screen.getByText('This page is loading')).toBeInTheDocument();
  });
});
