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
