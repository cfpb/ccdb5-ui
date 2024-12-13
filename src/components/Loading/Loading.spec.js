import { Loading } from './Loading';
import { testRender as render, screen } from '../../testUtils/test-utils';

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
