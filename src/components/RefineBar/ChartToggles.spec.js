import { ChartToggles } from './ChartToggles';
import React from 'react';
import { merge } from '../../testUtils/functionHelpers';
import { defaultTrends } from '../../reducers/trends/trends';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import * as trendsActions from '../../actions/trends';

describe('ChartToggles', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = (newTrendsState) => {
    merge(newTrendsState, defaultTrends);
    const data = {
      trends: newTrendsState,
    };

    render(<ChartToggles />, {
      preloadedState: data,
    });
  };

  it('renders default state', () => {
    const changeChartTypeSpy = jest
      .spyOn(trendsActions, 'changeChartType')
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
      .spyOn(trendsActions, 'changeChartType')
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
