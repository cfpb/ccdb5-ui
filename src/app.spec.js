import App from './app';
import { Provider } from 'react-redux';
import { DSRProvider } from '@cfpb/design-system-react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen } from '@testing-library/react';
import * as useUpdateLocationHook from './hooks/use-update-location';
import { ComplaintDetail } from './components/complaint-detail/complaint-detail';
import { DsrLink } from './components/dsr-link/dsr-link';
import { configureStoreUtil, waitFor } from './test-utils/test-utils';
import { aggResponse } from './components/list/list-panel/fixture';

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
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
      return Promise.resolve({
        body: JSON.stringify(aggResponse),
      });
    });
    const updateLocationHookSpy = rs.spyOn(
      useUpdateLocationHook,
      'useUpdateLocation',
    );
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await screen.findByText(/Search complaint data/);
    expect(updateLocationHookSpy).toHaveBeenCalled();
    expect(screen.getByText(/Consumer Complaint Database/)).toBeInTheDocument();
    expect(
      screen.getByLabelText('Choose which field will be searched'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Show search tips/ }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Take a tour/ }),
      ).toBeInTheDocument();
    });
  }, 10_000);

  it('renders the detail route', () => {
    render(
      <MemoryRouter initialEntries={['/detail/6026335']}>
        <Provider store={store}>
          <DSRProvider LinkComponent={DsrLink}>
            <Routes>
              <Route path="/detail/:id" element={<ComplaintDetail />} />
            </Routes>
          </DSRProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', { name: /Back to search results/ }),
    ).toBeInTheDocument();
  });
});
