import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../../testUtils/functionHelpers';
import { queryState } from '../../../reducers/query/querySlice';
import * as queryActions from '../../../reducers/query/querySlice';
import * as utils from '../../../utils';
import { DateRanges } from './DateRanges';
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
    dateRangeToggledFn = jest.spyOn(queryActions, 'dateRangeChanged');
    sendAnalyticsEventFn = jest.spyOn(utils, 'sendAnalyticsEvent');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render initial state', () => {
    const ranges = Object.values(dateRanges);
    const query = {
      dateRange: 'All',
      tab: 'Trends',
    };

    renderComponent(query);

    expect(
      screen.getByText('Date range (Click to modify range)'),
    ).toBeInTheDocument();

    ranges.forEach((range) => {
      expect(screen.getByRole('button', { name: range })).toBeInTheDocument();
    });
  });

  it('should select button and trigger toggle on newly selected range', async () => {
    const query = {
      dateRange: 'All',
      tab: 'Trends',
    };

    renderComponent(query);

    await user.click(screen.getByRole('button', { name: '1 year' }));

    expect(dateRangeToggledFn).toHaveBeenCalledWith('1y');
    expect(sendAnalyticsEventFn).toHaveBeenCalledWith('Button', 'Trends:1y');
  });

  it('should not trigger toggle on already selected range', async () => {
    const query = {
      dateRange: 'All',
      tab: 'Trends',
    };

    renderComponent(query);

    await user.click(screen.getByRole('button', { name: 'Full date range' }));

    expect(dateRangeToggledFn).not.toHaveBeenCalled();
    expect(sendAnalyticsEventFn).not.toHaveBeenCalled();
  });
});
