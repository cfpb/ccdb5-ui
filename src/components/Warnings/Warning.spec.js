import { Warning } from './Warning';
import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';

jest.useRealTimers();
describe('component:Warning', () => {
  const user = userEvent.setup();
  it('renders Warning without crashing', () => {
    const props = {
      text: 'Some nag message',
    };

    render(<Warning {...props} />);
    expect(screen.getByText(props.text)).toBeInTheDocument();
  });

  it('renders Warning w/ close button without crashing', async () => {
    const props = {
      closeFn: jest.fn(),
      text: 'Some nag message you can close',
    };

    render(<Warning {...props} />);
    expect(screen.getByText(props.text)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(props.closeFn).toHaveBeenCalled();
  });
});
