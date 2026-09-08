import { screen, testRender as render } from '../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../../test-utils/function-helpers';
import * as queryActions from '../../../reducers/query/query-slice';
import { queryState } from '../../../reducers/query/query-slice';
import * as utils from '../../../utils';
import { DateRanges } from './date-ranges';
import { dateRanges } from '../../../constants';

const renderComponent = (newQueryState = {}) => {
  merge(newQueryState, queryState);

  const data = {
    query: newQueryState,
  };

  render(<DateRanges />, {
    preloadedState: data,
  });
};

describe('component::DateRanges', () => {
  const user = userEvent.setup({ delay: null });

  let dateRangeToggledFn, sendAnalyticsEventFn;

  beforeEach(() => {
    dateRangeToggledFn = rs.spyOn(queryActions, 'dateRangeChanged');
    sendAnalyticsEventFn = rs.spyOn(utils, 'sendAnalyticsEvent');
  });

  afterEach(() => {
    rs.restoreAllMocks();
  });

  it('should render initial state', () => {
    const ranges = Object.values(dateRanges);
    const query = {
      dateRange: 'All',
    };

    renderComponent(query);

    expect(screen.getByText('Select date range')).toBeInTheDocument();

    for (const range of ranges) {
      const button = screen.getByRole('button', { name: range });
      expect(button).toHaveClass('a-btn--secondary');
      expect(button).toHaveAttribute('aria-pressed');
    }

    expect(screen.getByRole('button', { name: 'Full date range' })).toHaveClass(
      'active',
    );
  });

  it('should select button and trigger toggle on newly selected range', async () => {
    const query = {
      dateRange: 'All',
    };

    renderComponent(query);

    await user.click(screen.getByRole('button', { name: '1 year' }));

    expect(dateRangeToggledFn).toHaveBeenCalledWith('1y');
    expect(sendAnalyticsEventFn).toHaveBeenCalledWith('Button', '1y');
  });

  it('should not trigger toggle on already selected range', async () => {
    const query = {
      dateRange: 'All',
    };

    renderComponent(query);

    await user.click(screen.getByRole('button', { name: 'Full date range' }));

    expect(dateRangeToggledFn).not.toHaveBeenCalled();
    expect(sendAnalyticsEventFn).not.toHaveBeenCalled();
  });
});
