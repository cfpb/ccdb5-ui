import { Loading } from './loading';
import { screen, testRender as render } from '../../test-utils/test-utils';

describe('Loading', () => {
  it('renders nothing when isLoading is false', () => {
    render(<Loading isLoading={false} />);
    expect(screen.queryByText('This page is loading')).not.toBeInTheDocument();
  });

  it('renders when isLoading is true', () => {
    render(<Loading isLoading={true} />);
    expect(screen.getByText('This page is loading')).toBeInTheDocument();
  });
});
