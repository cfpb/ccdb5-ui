import { ChartToggles } from './ChartToggles';
import { merge } from '../../testUtils/functionHelpers';
import { trendsState } from '../../reducers/trends/trendsSlice';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import * as trendsActions from '../../reducers/trends/trendsSlice';

describe('ChartToggles', () => {
  const renderComponent = (newTrendsState) => {
    merge(newTrendsState, trendsState);
    const data = {
      trends: newTrendsState,
    };

    render(<ChartToggles />, {
      preloadedState: data,
    });
  };

  it('renders default state', () => {
    const changeChartTypeSpy = jest
      .spyOn(trendsActions, 'chartTypeUpdated')
      .mockImplementation(() => jest.fn());

    renderComponent({});
    expect(screen.getByText('Chart type')).toBeInTheDocument();
    const buttonLineChart = screen.getByLabelText('Toggle line chart');
    expect(buttonLineChart).toBeInTheDocument();
    expect(buttonLineChart).toBeDisabled();
    expect(buttonLineChart).toHaveClass('selected');
    fireEvent.click(buttonLineChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(0);

    const buttonAreaChart = screen.getByLabelText('Toggle area chart');
    expect(buttonAreaChart).toBeInTheDocument();
    expect(buttonAreaChart).toBeEnabled();

    fireEvent.click(buttonAreaChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(1);
  });

  it('renders area chartType state without crashing', () => {
    const changeChartTypeSpy = jest
      .spyOn(trendsActions, 'chartTypeUpdated')
      .mockImplementation(() => jest.fn());

    renderComponent({ chartType: 'area' });
    expect(screen.getByText('Chart type')).toBeInTheDocument();
    const buttonAreaChart = screen.getByLabelText('Toggle area chart');
    expect(buttonAreaChart).toBeInTheDocument();
    expect(buttonAreaChart).toBeDisabled();
    expect(buttonAreaChart).toHaveClass('selected');
    fireEvent.click(buttonAreaChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(0);

    const buttonLineChart = screen.getByLabelText('Toggle line chart');
    expect(buttonLineChart).toBeInTheDocument();
    expect(buttonLineChart).toBeEnabled();

    fireEvent.click(buttonLineChart);
    expect(changeChartTypeSpy).toHaveBeenCalledTimes(1);
  });
});
