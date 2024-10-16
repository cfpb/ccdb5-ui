import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../testUtils/functionHelpers';
import { defaultQuery } from '../../reducers/query/query';
import * as filtersActions from '../../actions/filter';
import * as utils from '../../utils';
import { DateRanges } from './DateRanges';

const renderComponent = (newQueryState = {}) => {
  merge(newQueryState, defaultQuery);

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
    dateRangeToggledFn = jest.spyOn(filtersActions, 'dateRangeToggled');
    sendAnalyticsEventFn = jest.spyOn(utils, 'sendAnalyticsEvent');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render initial state', () => {
    const ranges = ['3m', '6m', '1y', '3y', 'All'];
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

    await user.click(screen.getByRole('button', { name: '1y' }));

    expect(dateRangeToggledFn).toHaveBeenCalledWith('1y');
    expect(sendAnalyticsEventFn).toHaveBeenCalledWith('Button', 'Trends:1y');
  });

  it('should not trigger toggle on already selected range', async () => {
    const query = {
      dateRange: 'All',
      tab: 'Trends',
    };

    renderComponent(query);

    await user.click(screen.getByRole('button', { name: 'All' }));

    expect(dateRangeToggledFn).not.toHaveBeenCalled();
    expect(sendAnalyticsEventFn).not.toHaveBeenCalled();
  });
});
