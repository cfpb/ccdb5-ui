import { App, DetailComponents } from '../App';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import React from 'react';
import thunk from 'redux-thunk';
import 'regenerator-runtime/runtime';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import * as useUpdateLocationHook from '../hooks/useUpdateLocation';
import { defaultQuery } from '../reducers/query/query';

jest.mock('highcharts/modules/accessibility');
jest.mock('highcharts/highmaps');

describe('initial state', () => {
  test('renders search page', () => {
    const updateLocationHookSpy = jest
      .spyOn(useUpdateLocationHook, 'useUpdateLocation')
      .mockImplementation(() => jest.fn());
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const store = mockStore({
      query: defaultQuery,
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(updateLocationHookSpy).toBeCalledTimes(1);

    expect(screen.getByText(/Consumer Complaint Database/)).toBeDefined();
    expect(screen.getByText(/Search within/)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Show advanced search tips/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Take a tour/ })
    ).toBeInTheDocument();
  });

  it('renders the detail route', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const store = mockStore({
      detail: { data: {}, error: '' },
      query: {
        search: '?something',
      },
    });

    render(
      <MemoryRouter initialEntries={['/detail/6026335']}>
        <Provider store={store}>
          <Routes>
            <Route path="/detail/:id" element={<DetailComponents />} />
          </Routes>
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /Back to search results/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Back to search results/ })
    ).toHaveAttribute('href', '/?something');

    expect(screen.getByText('This page is loading')).toBeInTheDocument();
  });
});
