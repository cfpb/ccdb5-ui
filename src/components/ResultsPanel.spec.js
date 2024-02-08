import { ResultsPanel } from './ResultsPanel';
import React from 'react';
import { testRender as render, screen } from '../testUtils/test-utils';
import { queryState } from '../reducers/query/query';
import { viewState } from '../reducers/view/view';
import { merge } from '../testUtils/functionHelpers';
import { MODE_LIST, MODE_MAP } from '../constants';

describe('ResultsPanel', () => {
  const renderComponent = (newQueryState, newViewState) => {
    merge(newQueryState, queryState);
    merge(newViewState, viewState);

    render(<ResultsPanel />, {
      preloadedState: {
        query: newQueryState,
        view: newViewState,
      },
    });
  };

  it('renders trends panel without crashing', () => {
    renderComponent({});
    expect(screen.getByRole('button', { name: /Trends/ })).toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /Map/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders list panel without crashing', () => {
    renderComponent({ tab: MODE_LIST }, {});
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /List/ })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /Map/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders map panel without crashing', () => {
    renderComponent({ tab: MODE_MAP }, {});
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /Map/ })).toHaveClass('active');
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders printMode without crashing', () => {
    renderComponent(
      { searchText: 'Tacos', tab: MODE_MAP },
      { isPrintMode: true }
    );
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /Map/ })).toHaveClass('active');
    expect(screen.getByText('Export data')).toBeInTheDocument();
    expect(screen.getByText('Search Term:')).toBeInTheDocument();
    expect(screen.getByText('Tacos')).toBeInTheDocument();
    expect(screen.getByText('URL:')).toBeInTheDocument();
  });
});
