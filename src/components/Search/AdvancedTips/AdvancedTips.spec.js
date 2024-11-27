import { AdvancedTips } from './AdvancedTips';
import {
  testRender as render,
  fireEvent,
  screen,
  waitFor,
} from '../../../testUtils/test-utils';

describe('AdvancedTips', () => {
  it('renders', async () => {
    render(<AdvancedTips />);
    expect(screen.getByText('Search tips')).toBeInTheDocument();
    expect(screen.getByText('AND / OR / NOT')).toBeInTheDocument();
    expect(screen.getByText('Must/Must not contain')).toBeInTheDocument();
    expect(screen.getByText('Wildcard search')).toBeInTheDocument();
    expect(screen.getByText('Proximity search')).toBeInTheDocument();
    expect(screen.getByText('Fuzzy search')).toBeInTheDocument();
    expect(screen.getByText('Boost search')).toBeInTheDocument();
    expect(screen.getByText('Additional notes:')).toBeInTheDocument();

    expect(
      screen.getByLabelText('Use AND when results must contain all terms'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('label', { name: 'Complex example:' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByDisplayValue(
        'call AND (harass* OR annoy* OR threat OR repeat) AND NOT spam',
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getAllByRole('heading', {
        name: 'Additional information and examples',
      })[0],
    );
    await waitFor(() =>
      expect(
        screen.getByDisplayValue(
          'call AND (harass* OR annoy* OR threat OR repeat) AND NOT spam',
        ),
      ).toBeVisible(),
    );
  });
});
