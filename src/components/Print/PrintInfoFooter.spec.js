import { PrintInfoFooter } from './PrintInfoFooter';
import { testRender as render, screen } from '../../testUtils/test-utils';

describe('PrintInfoFooter', () => {
  it('renders default empty state', () => {
    render(<PrintInfoFooter />, {});
    expect(screen.queryByText('URL:')).toBeNull();
    expect(screen.queryByText('http://localhost/')).toBeNull();
  });
  it('renders default state', () => {
    render(<PrintInfoFooter />, {
      preloadedState: {
        view: {
          isPrintMode: true,
        },
      },
    });
    expect(screen.getByText('URL:')).toBeInTheDocument();
    expect(screen.getByText('http://localhost/')).toBeInTheDocument();
  });
});
