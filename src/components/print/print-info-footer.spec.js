import { PrintInfoFooter } from './print-info-footer';
import { screen, testRender as render } from '../../test-utils/test-utils';

describe('PrintInfoFooter', () => {
  it('renders default empty state', () => {
    render(<PrintInfoFooter />, {});
    expect(screen.queryByText('URL:')).not.toBeInTheDocument();
    expect(
      screen.queryByText('http://localhost:3000/'),
    ).not.toBeInTheDocument();
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
    expect(screen.getByText('http://localhost:3000/')).toBeInTheDocument();
  });
});
