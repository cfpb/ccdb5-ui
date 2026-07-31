import { screen, testRender as render } from '../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../../test-utils/function-helpers';
import * as queryActions from '../../../reducers/query/query-slice';
import { queryState } from '../../../reducers/query/query-slice';
import { viewState } from '../../../reducers/view/view-slice';
import * as utils from '../../../utils';
import { DateRanges } from './date-ranges';
import { dateRanges } from '../../../constants';

const renderComponent = (newQueryState = {}, newViewState = {}) => {
  merge(newQueryState, queryState);
  merge(newViewState, viewState);

  const data = {
    query: newQueryState,
    view: newViewState,
  };

  render(<DateRanges />, {
    preloadedState: data,
  });
};

describe('component::DateRanges', () => {
  const user = userEvent.setup({ delay: null });

  let dateRangeToggledFn, sendAnalyticsEventFn;

  beforeEach(() => {
    dateRangeToggledFn = jest.spyOn(queryActions, 'dateRangeChanged');
    sendAnalyticsEventFn = jest.spyOn(utils, 'sendAnalyticsEvent');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render initial state', () => {
    const ranges = Object.values(dateRanges);

    renderComponent({ dateRange: 'All' }, { tab: 'Trends' });

    expect(screen.getByText('Date range')).toBeInTheDocument();

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
    renderComponent({ dateRange: 'All' }, { tab: 'Trends' });

    await user.click(screen.getByRole('button', { name: '1 year' }));

    expect(dateRangeToggledFn).toHaveBeenCalledWith('1y');
    expect(sendAnalyticsEventFn).toHaveBeenCalledWith('Button', 'Trends:1y');
  });

  it('should not trigger toggle on already selected range', async () => {
    renderComponent({ dateRange: 'All' }, { tab: 'Trends' });

    await user.click(screen.getByRole('button', { name: 'Full date range' }));

    expect(dateRangeToggledFn).not.toHaveBeenCalled();
    expect(sendAnalyticsEventFn).not.toHaveBeenCalled();
  });
});
