import { ChartToggles } from './chart-toggles';
import { merge } from '../../test-utils/function-helpers';
import * as trendsActions from '../../reducers/trends/trends-slice';
import { trendsState } from '../../reducers/trends/trends-slice';
import { screen, testRender as render } from '../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';

describe('ChartToggles', () => {
  const user = userEvent.setup({ delay: null });

  const renderComponent = (newTrendsState) => {
    merge(newTrendsState, trendsState);
    const data = {
      trends: newTrendsState,
    };

    render(<ChartToggles />, {
      preloadedState: data,
    });
  };

  let changeChartTypeSpy;
  beforeEach(() => {
    changeChartTypeSpy = jest
      .spyOn(trendsActions, 'chartTypeUpdated')
      .mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders default state', async () => {
    renderComponent({});
    expect(screen.getByText('Select chart type')).toHaveClass(
      'a-label',
      'a-label--heading',
    );
    const buttonLineChart = screen.getByRole('button', { name: 'Line chart' });
    expect(buttonLineChart).toBeInTheDocument();
    expect(buttonLineChart).toHaveClass('active');
    expect(buttonLineChart).toHaveAttribute('aria-pressed', 'true');
    await user.click(buttonLineChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(0);

    const buttonAreaChart = screen.getByRole('button', {
      name: 'Area chart',
    });
    expect(buttonAreaChart).toBeInTheDocument();
    expect(buttonAreaChart).toHaveAttribute('aria-pressed', 'false');

    await user.click(buttonAreaChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(1);
  });

  it('renders area chartType state without crashing', async () => {
    renderComponent({ chartType: 'area' });
    expect(screen.getByText('Select chart type')).toBeInTheDocument();
    const buttonAreaChart = screen.getByRole('button', {
      name: 'Area chart',
    });
    expect(buttonAreaChart).toBeInTheDocument();
    expect(buttonAreaChart).toHaveClass('active');
    expect(buttonAreaChart).toHaveAttribute('aria-pressed', 'true');
    await user.click(buttonAreaChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(0);

    const buttonLineChart = screen.getByRole('button', { name: 'Line chart' });
    expect(buttonLineChart).toBeInTheDocument();
    expect(buttonLineChart).toHaveAttribute('aria-pressed', 'false');

    await user.click(buttonLineChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(1);
  });
});
