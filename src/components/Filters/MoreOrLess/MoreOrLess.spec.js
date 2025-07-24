import { screen, testRender as render } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { MoreOrLess } from './MoreOrLess';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';

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
  let props;

  beforeEach(() => {
    props = {
      fieldName: 'myfield',
      listComponent: AggregationItem,
      options: fixture,
    };
  });

  it('displays and toggles properly when more results are available', async () => {
    renderComponent(props);
    expect(
      screen.getByRole('button', { name: /Show 3 more/ }),
    ).toBeInTheDocument();
  });

  it('displays and toggles properly when no more results are available', async () => {
    renderComponent(props);
    expect(
      screen.getByRole('button', { name: /Show 3 more/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show 3 more/ }));
    expect(
      screen.queryByRole('button', { name: /Show 3 more/ }),
    ).not.toBeInTheDocument();
  });
});
