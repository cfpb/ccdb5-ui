import { PerCapita } from './PerCapita';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { filtersState } from '../../reducers/filters/filtersSlice';
import { GEO_NORM_NONE, GEO_NORM_PER1000 } from '../../constants';
import userEvent from '@testing-library/user-event';

jest.useRealTimers();

describe('PerCapita', () => {
  const user = userEvent.setup();
  const renderComponent = (newFiltersState) => {
    merge(newFiltersState, filtersState);
    const data = {
      filters: newFiltersState,
    };

    render(<PerCapita />, {
      preloadedState: data,
    });
  };

  it('should render', () => {
    renderComponent({
      dataNormalization: GEO_NORM_NONE,
      enablePer1000: false,
    });
    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });

    expect(buttonComplaints).toBeInTheDocument();
    expect(buttonComplaints).toBeDisabled();
    expect(buttonComplaints).toHaveClass('selected');
    expect(
      screen.getByRole('button', {
        name: 'Display map by complaints per 1,000 people',
      }),
    ).toBeInTheDocument();
  });

  it('renders dataNormalizationChanged GEO_NORM_NONE and handles action', async () => {
    renderComponent({
      dataNormalization: GEO_NORM_PER1000,
      enablePer1000: false,
    });
    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });
    expect(buttonComplaints).toBeInTheDocument();
    expect(buttonComplaints).toBeEnabled();

    const buttonPer1000 = screen.getByRole('button', {
      name: 'Display map by complaints per 1,000 people',
    });
    expect(buttonPer1000).toBeInTheDocument();
    expect(buttonPer1000).toBeDisabled();
    expect(buttonPer1000).toHaveClass('a-btn__disabled');
    // make sure action doesn't fire since its disabled
    await user.click(buttonPer1000);
    expect(buttonPer1000).toBeDisabled();
    await user.click(buttonComplaints);
    expect(buttonComplaints).toBeDisabled();
  });

  it('renders dataNormalizationChanged GEO_NORM_PER1000 and handles action', () => {
    renderComponent({
      dataNormalization: GEO_NORM_NONE,
      enablePer1000: true,
    });

    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });

    expect(buttonComplaints).toBeInTheDocument();
    expect(buttonComplaints).toBeDisabled();

    user.click(buttonComplaints);
    const buttonPer1000 = screen.getByRole('button', {
      name: 'Display map by complaints per 1,000 people',
    });
    expect(buttonPer1000).toBeInTheDocument();
    expect(buttonPer1000).toBeEnabled();
    // make sure action doesn't fire since its disabled
    user.click(buttonPer1000);
    expect(buttonPer1000).toBeEnabled();
  });

  it('renders GEO_NORM_PER1000 selected state and does nothing', () => {
    renderComponent({
      dataNormalization: GEO_NORM_PER1000,
      enablePer1000: true,
    });

    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });

    expect(buttonComplaints).toBeInTheDocument();

    const buttonPer1000 = screen.getByRole('button', {
      name: 'Display map by complaints per 1,000 people',
    });
    expect(buttonPer1000).toBeInTheDocument();
    expect(buttonPer1000).toHaveClass('selected');
    expect(buttonPer1000).toBeDisabled();
    // make sure action doesn't fire since its disabled
    user.click(buttonPer1000);
    expect(buttonPer1000).toBeDisabled();
  });
});
