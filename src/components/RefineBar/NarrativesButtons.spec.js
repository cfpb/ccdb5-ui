import userEvent from '@testing-library/user-event';
import { NarrativesButtons } from './NarrativesButtons';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { filtersState } from '../../reducers/filters/filtersSlice';

jest.useRealTimers();

describe('NarrativesButtons', () => {
  const user = userEvent.setup();
  const renderComponent = (newFiltersState) => {
    merge(newFiltersState, filtersState);
    const data = {
      filters: newFiltersState,
    };

    render(<NarrativesButtons />, {
      preloadedState: data,
    });
  };

  it('should render default state', async () => {
    renderComponent({ foo: 'bar' });

    expect(screen.getByText('Read')).toBeInTheDocument();
    const btnAllComplaints = screen.getByRole('button', {
      name: 'All complaints',
    });
    const btnNarratives = screen.getByRole('button', {
      name: 'Only complaints with narratives',
    });
    expect(btnAllComplaints).toBeInTheDocument();
    expect(btnAllComplaints).toBeDisabled();
    expect(btnAllComplaints).toHaveClass('selected');
    // do nothing
    await user.click(btnAllComplaints);
    expect(btnAllComplaints).toBeDisabled();
    expect(btnNarratives).toBeEnabled();

    await user.click(btnNarratives);
    expect(btnNarratives).toHaveClass('a-btn selected');
    expect(btnAllComplaints).toBeEnabled();
    expect(btnNarratives).toBeDisabled();
    expect(btnNarratives).toBeDisabled();
  });
});
