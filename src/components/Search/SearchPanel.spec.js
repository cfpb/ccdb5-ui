import { SearchPanel } from './SearchPanel';
import { testRender as render, screen } from '../../testUtils/test-utils';

const renderComponent = () => {
  const data = {
    aggs: {
      lastIndexed: new Date('2016-02-01T05:00:00.000Z').toString(),
    },
  };

  render(<SearchPanel />, {
    preloadedState: data,
  });
};

describe('component:SearchPanel', () => {
  it('renders without crashing', () => {
    renderComponent();
    expect(
      screen.getByText('Date Received: 5/5/2017 - 5/5/2020'),
    ).toBeInTheDocument();
    expect(screen.getByText(/2\/1\/2016/)).toBeInTheDocument();
  });
});
