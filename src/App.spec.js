import App from './App';
import { Provider } from 'react-redux';
import 'regenerator-runtime/runtime';
import { render, screen, waitFor } from '@testing-library/react';
import * as useUpdateLocationHook from './hooks/useUpdateLocation';
import store from './app/store';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ComplaintDetail } from './components/ComplaintDetail/ComplaintDetail';

jest.mock('highcharts/modules/accessibility');
jest.mock('highcharts/highmaps');

describe('initial state', () => {
  it('renders search page', () => {
    const updateLocationHookSpy = jest.spyOn(
      useUpdateLocationHook,
      'useUpdateLocation',
    );

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(updateLocationHookSpy).toBeCalled();

    expect(screen.getByText(/Consumer Complaint Database/)).toBeInTheDocument();
    expect(screen.getByText(/Search within/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Show advanced search tips/ }),
    ).toBeInTheDocument();
  });

  it('renders tour button', async () => {
    const updateLocationHookSpy = jest
      .spyOn(useUpdateLocationHook, 'useUpdateLocation')
      .mockImplementation(() => jest.fn());

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(updateLocationHookSpy).toBeCalled();

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
  });

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
    ).toHaveAttribute(
      'href',
      '/?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
    );

    expect(screen.getByText('This page is loading')).toBeInTheDocument();
  });
});
