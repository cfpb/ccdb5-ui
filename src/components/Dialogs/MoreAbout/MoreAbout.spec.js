import { MoreAbout } from './MoreAbout';
import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';

jest.useRealTimers();
describe('MoreAbout', () => {
  const user = userEvent.setup();
  it('renders without crashing', async () => {
    const closeSpy = jest.fn();
    render(<MoreAbout onClose={closeSpy} />);
    expect(
      screen.getByText('Things you should know before you use this database'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(closeSpy).toHaveBeenCalled();
  });
});
