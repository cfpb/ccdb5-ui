import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../app/store';
import { SearchComponents } from './SearchComponents';

describe('SearchComponents', () => {
  it('renders the search container', () => {
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
