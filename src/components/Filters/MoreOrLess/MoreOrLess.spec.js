import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import MoreOrLess from './MoreOrLess';
import AggregationItem from '../AggregationItem/AggregationItem';

const fixture = [
  { key: 'alpha', doc_count: 99 },
  { key: 'beta', doc_count: 99 },
  { key: 'gamma', doc_count: 99 },
  { key: 'delta', doc_count: 99 },
  { key: 'epsilon', doc_count: 99 },
  { key: 'zeta', doc_count: 99 },
  { key: 'eta', doc_count: 99 },
  { key: 'theta', doc_count: 99 },
];

const renderComponent = (props) => {
  return render(<MoreOrLess {...props} />);
};

describe('component:MoreOrLess', () => {
  const user = userEvent.setup({ delay: null });
  const props = {
    hasMore: true,
    listComponent: AggregationItem,
    listComponentProps: { fieldName: 'myfield' },
    options: fixture,
  };

  test('matches - Show NN less', () => {
    renderComponent(props);
    expect(
      screen.getByRole('button', { name: /Show 3 less/ }),
    ).toBeInTheDocument();
  });

  test('matches - Show NN more', async () => {
    renderComponent(props);
    await user.click(screen.getByRole('button', { name: /Show 3 less/ }));
    expect(
      screen.getByRole('button', { name: /Show 3 more/ }),
    ).toBeInTheDocument();
  });
});
