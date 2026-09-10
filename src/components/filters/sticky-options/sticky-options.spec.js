import { screen, testRender as render } from '../../../test-utils/test-utils';
import { StickyOptions } from './sticky-options';

describe('StickyOptions', () => {
  test('renders nothing when there are no selections', () => {
    render(<StickyOptions fieldName="state" options={[]} selections={[]} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
