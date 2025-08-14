import { ChartToggles } from './ChartToggles';
import { merge } from '../../testUtils/functionHelpers';
import * as trendsActions from '../../reducers/trends/trendsSlice';
import { trendsState } from '../../reducers/trends/trendsSlice';
import { screen, testRender as render } from '../../testUtils/test-utils';
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
    expect(screen.getByText('Chart type')).toBeInTheDocument();
    const buttonLineChart = screen.getByLabelText('Toggle line chart');
    expect(buttonLineChart).toBeInTheDocument();
    expect(buttonLineChart).toBeDisabled();
    expect(buttonLineChart).toHaveClass('selected');
    await user.click(buttonLineChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(0);

    const buttonAreaChart = screen.getByLabelText('Toggle area chart');
    expect(buttonAreaChart).toBeInTheDocument();
    expect(buttonAreaChart).toBeEnabled();

    await user.click(buttonAreaChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(1);
  });

  it('renders area chartType state without crashing', async () => {
    renderComponent({ chartType: 'area' });
    expect(screen.getByText('Chart type')).toBeInTheDocument();
    const buttonAreaChart = screen.getByLabelText('Toggle area chart');
    expect(buttonAreaChart).toBeInTheDocument();
    expect(buttonAreaChart).toBeDisabled();
    expect(buttonAreaChart).toHaveClass('selected');
    await user.click(buttonAreaChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(0);

    const buttonLineChart = screen.getByLabelText('Toggle line chart');
    expect(buttonLineChart).toBeInTheDocument();
    expect(buttonLineChart).toBeEnabled();

    await user.click(buttonLineChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(1);
  });
});
