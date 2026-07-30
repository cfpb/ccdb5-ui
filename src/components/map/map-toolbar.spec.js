import { MapToolbar } from './map-toolbar';
import { merge } from '../../test-utils/function-helpers';
import * as filterActions from '../../reducers/filters/filters-slice';
import { filtersState } from '../../reducers/filters/filters-slice';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../test-utils/test-utils';

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
    expect(
      screen.getByRole('button', { name: 'Florida (FL)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Texas (TX)' }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Clear all state filters' }),
    );
    expect(stateFilterClearedSpy).toHaveBeenCalledTimes(1);
  });
});
