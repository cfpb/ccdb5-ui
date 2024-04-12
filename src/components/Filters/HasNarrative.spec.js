import { HasNarrative } from './HasNarrative';
import { merge } from '../../testUtils/functionHelpers';
import { testRender as render, screen } from '../../testUtils/test-utils';
import * as filtersActions from '../../actions/filter';
import { defaultQuery } from '../../reducers/query/query';
import userEvent from '@testing-library/user-event';

jest.useRealTimers();

const renderComponent = (newQueryState) => {
  merge(newQueryState, defaultQuery);
  const data = {
    query: newQueryState,
  };
  render(<HasNarrative />, { preloadedState: data });
};

describe('component::HasNarrative', () => {
  const user = userEvent.setup();
  it('renders without crashing', async () => {
    const filterToggleSpy = jest.spyOn(filtersActions, 'toggleFlagFilter');
    renderComponent({});
    expect(screen.getByRole('checkbox', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Yes' })).not.toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Yes' }));
    expect(filterToggleSpy).toHaveBeenCalled();
    expect(screen.getByRole('checkbox', { name: 'Yes' })).toBeChecked();
  });

  it('pre-check filter based on filter', () => {
    const query = {
      has_narrative: true,
    };
    renderComponent(query);
    expect(screen.getByRole('checkbox', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Yes' })).toBeChecked();
  });

  it('checks and disables the filter when searching narratives', () => {
    const query = {
      searchField: 'complaint_what_happened',
    };
    renderComponent(query);
    expect(screen.getByRole('checkbox', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Yes' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Yes' })).toBeDisabled();
  });
});
