import {
  mapDispatchToProps,
  mapStateToProps,
  ChartToggles,
} from '../RefineBar/ChartToggles';
import React from 'react';
import { shallow } from 'enzyme';
import * as utils from '../../utils';

/**
 *
 * @param cb
 * @param chartType
 */
function setupEnzyme(cb, chartType) {
  return shallow(<ChartToggles toggleChartType={cb} chartType={chartType} />);
}

describe('component: ChartToggles', () => {
  describe('buttons', () => {
    let cb = null;
    let target = null;

    beforeEach(() => {
      cb = jest.fn();
    });

    it('Line - changeChartType is called the button is clicked', () => {
      target = setupEnzyme(cb, 'foo');
      const prev = target.find('.chart-toggles .line');
      prev.simulate('click');
      expect(cb).toHaveBeenCalledWith('line');
    });

    it('Area - changeChartType is called the button is clicked', () => {
      target = setupEnzyme(cb, 'foo');
      const prev = target.find('.chart-toggles .area');
      prev.simulate('click');
      expect(cb).toHaveBeenCalledWith('area');
    });

    it('changeChartType is NOT called when chartType is the same', () => {
      target = setupEnzyme(cb, 'line');
      const prev = target.find('.chart-toggles .line');
      prev.simulate('click');
      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    it('provides a way to call changeChartType', () => {
      const dispatch = jest.fn();
      const gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
      mapDispatchToProps(dispatch).toggleChartType('my-chart');
      expect(dispatch.mock.calls).toEqual([
        [
          {
            chartType: 'my-chart',
            requery: 'REQUERY_NEVER',
            type: 'CHART_TYPE_CHANGED',
          },
        ],
      ]);
      expect(gaSpy).toHaveBeenCalledWith('Button', 'Trends:my-chart');
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        trends: {
          chartType: 'foo',
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({ chartType: 'foo' });
    });
  });
});
