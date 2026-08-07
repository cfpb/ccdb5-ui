import userEvent from '@testing-library/user-event';
import { NarrativesButtons } from './narratives-buttons';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { merge } from '../../test-utils/function-helpers';
import { filtersState } from '../../reducers/filters/filters-slice';

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

    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('View')).toHaveClass('a-label', 'a-label--heading');
    const btnAllComplaints = screen.getByRole('button', {
      name: 'All complaints',
    });
    const btnNarratives = screen.getByRole('button', {
      name: 'Complaints with narratives',
    });
    expect(btnAllComplaints).toBeInTheDocument();
    expect(btnAllComplaints).toHaveAttribute('aria-pressed', 'true');
    expect(btnAllComplaints).toHaveClass('a-btn--secondary', 'active');
    expect(btnNarratives).toHaveClass('a-btn--secondary');
    expect(btnNarratives).not.toHaveClass('active');
    expect(btnNarratives).toHaveAttribute('aria-pressed', 'false');

    // Already selected — no change
    await user.click(btnAllComplaints);
    expect(btnAllComplaints).toHaveAttribute('aria-pressed', 'true');
    expect(btnAllComplaints).toHaveClass('a-btn--secondary', 'active');

    await user.click(btnNarratives);
    expect(btnNarratives).toHaveClass('a-btn--secondary', 'active');
    expect(btnNarratives).toHaveAttribute('aria-pressed', 'true');
    expect(btnAllComplaints).toHaveClass('a-btn--secondary');
    expect(btnAllComplaints).not.toHaveClass('active');
    expect(btnAllComplaints).toHaveAttribute('aria-pressed', 'false');
  });
});
