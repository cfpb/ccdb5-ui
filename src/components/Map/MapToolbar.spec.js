import { MapToolbar } from './MapToolbar';
import { merge } from '../../testUtils/functionHelpers';
import * as filterActions from '../../reducers/filters/filtersSlice';
import { filtersState } from '../../reducers/filters/filtersSlice';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../testUtils/test-utils';

describe('MapToolbar', () => {
  const renderComponent = (newFiltersState) => {
    merge(newFiltersState, filtersState);

    const data = {
      filters: newFiltersState,
    };

    render(<MapToolbar />, {
      preloadedState: data,
    });
  };
  it('does not render when there are no state filters', () => {
    renderComponent({});
    expect(screen.queryByText('State filters applied')).not.toBeInTheDocument();
  });

  it('renders filtered states and clears filters', () => {
    const stateFilterClearedSpy = jest
      .spyOn(filterActions, 'stateFilterCleared')
      .mockImplementation(() => jest.fn());

    renderComponent({
      state: ['FL', 'TX'],
    });
    expect(screen.getByRole('button', { name: 'Florida' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Texas' })).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Clear all state filters' }),
    );
    expect(stateFilterClearedSpy).toHaveBeenCalledTimes(1);
  });
});
