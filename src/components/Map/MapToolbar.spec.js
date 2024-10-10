import { MapToolbar } from './MapToolbar';
import { merge } from '../../testUtils/functionHelpers';
import { filtersState } from '../../reducers/filters/filtersSlice';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../testUtils/test-utils';
import * as filterActions from '../../reducers/filters/filtersSlice';
import * as viewActions from '../../reducers/view/viewSlice';

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
  it('renders no states filter without crashing', () => {
    renderComponent({});
    expect(screen.getByText('United States of America')).toBeInTheDocument();
  });

  it('renders filtered states and clears filters', () => {
    const stateFilterClearedSpy = jest
      .spyOn(filterActions, 'stateFilterCleared')
      .mockImplementation(() => jest.fn());

    renderComponent({
      state: ['FL', 'TX'],
    });
    expect(screen.getByText('Florida, Texas')).toBeInTheDocument();
    expect(screen.getByLabelText('Clear all map filters')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear'));
    expect(stateFilterClearedSpy).toHaveBeenCalledTimes(1);
  });

  it('renders filtered states and goes to list', () => {
    const showStateComplaintsSpy = jest
      .spyOn(viewActions, 'tabChanged')
      .mockImplementation(() => jest.fn());

    renderComponent({
      state: ['FL', 'TX'],
    });
    expect(screen.getByText('Florida, Texas')).toBeInTheDocument();
    fireEvent.click(screen.getByText('View complaints for filtered states'));
    expect(showStateComplaintsSpy).toHaveBeenCalledTimes(1);
    expect(showStateComplaintsSpy).toHaveBeenCalledWith('List');
  });
});
