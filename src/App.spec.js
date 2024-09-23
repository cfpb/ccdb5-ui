import App from './App';
import { Provider } from 'react-redux';
import 'regenerator-runtime/runtime';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import * as useUpdateLocationHook from './hooks/useUpdateLocation';
import store from './app/store';
import { ComplaintDetail } from './components/ComplaintDetail/ComplaintDetail';
jest.mock('highcharts/modules/accessibility');
jest.mock('highcharts/highmaps');

describe('initial state', () => {
  test('renders search page', () => {
    const updateLocationHookSpy = jest
      .spyOn(useUpdateLocationHook, 'useUpdateLocation')
      .mockImplementation(() => jest.fn());

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(updateLocationHookSpy).toBeCalledTimes(2);
    expect(screen.getByText(/Consumer Complaint Database/)).toBeDefined();
    expect(screen.getByText(/Search within/)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Show advanced search tips/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Take a tour/ }),
    ).toBeInTheDocument();
  });

  test('renders the detail route', () => {
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
