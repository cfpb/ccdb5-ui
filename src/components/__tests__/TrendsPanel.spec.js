import { TrendsPanel, mapDispatchToProps } from '../Trends/TrendsPanel';
import React from 'react';
import { shallow } from 'enzyme';
import * as utils from '../../utils';

jest.mock('britecharts', () => {
  const props = [
    'brush',
    'line',
    'tooltip',
    'margin',
    'backgroundColor',
    'colorSchema',
    'enableLabels',
    'labelsSize',
    'labelsTotalCount',
    'labelsNumberFormat',
    'outerPadding',
    'percentageAxisToMaxRatio',
    'yAxisLineWrapLimit',
    'dateRange',
    'yAxisPaddingBetweenChart',
    'width',
    'wrapLabels',
    'height',
    'on',
    'initializeVerticalMarker',
    'isAnimated',
    'tooltipThreshold',
    'grid',
    'aspectRatio',
    'dateLabel',
    'shouldShowDateInTitle',
    'topicLabel',
    'title',
  ];

  const mock = {};

  for (let i = 0; i < props.length; i++) {
    const propName = props[i];
    mock[propName] = jest.fn().mockImplementation(() => {
      return mock;
    });
  }

  return mock;
});

jest.mock('d3', () => {
  const props = [
    'select',
    'each',
    'node',
    'getBoundingClientRect',
    'width',
    'datum',
    'call',
    'remove',
    'selectAll',
  ];

  const mock = {};

  for (let i = 0; i < props.length; i++) {
    const propName = props[i];
    mock[propName] = jest.fn().mockImplementation(() => {
      return mock;
    });
  }

  // set narrow width value for 100% test coverage
  mock.width = 100;

  return mock;
});

/**
 *
 * @param root0
 * @param root0.focus
 * @param root0.hasOverview
 * @param root0.lens
 * @param root0.subLens
 */
function setupEnzyme({ focus, hasOverview, lens, subLens }) {
  const props = {
    focus,
    lenses: ['Foo', 'Baz', 'Bar'],
    intervals: ['Month', 'Quarter', 'Nickel', 'Day'],
    hasOverview,
    lens,
    subLens,
    onChartType: jest.fn(),
    onInterval: jest.fn(),
    onLens: jest.fn(),
  };
  const target = shallow(<TrendsPanel {...props} />);
  return target;
}

describe('component:TrendsPanel', () => {
  describe('helpers', () => {
    describe('areaChartTitle', () => {
      let params;
      beforeEach(() => {
        params = {
          focus: '',
          hasOverview: false,
          lens: 'Overview',
          subLens: 'sub_product',
        };
      });
      it('gets area chart title - Overview', () => {
        params.hasOverview = true;
        const target = setupEnzyme(params);
        expect(target.instance()._areaChartTitle()).toEqual(
          'Complaints by date received by the CFPB'
        );
      });

      it('gets area chart title - Data Lens', () => {
        params.lens = 'Something';
        const target = setupEnzyme(params);
        expect(target.instance()._areaChartTitle()).toEqual(
          'Complaints by date received by the CFPB'
        );
      });

      it('gets area chart title - Focus', () => {
        params.focus = 'Hello';
        params.lens = 'Product';
        const target = setupEnzyme(params);
        expect(target.instance()._areaChartTitle()).toEqual(
          'Complaints by sub-products, by date received by the CFPB'
        );
      });
    });
  });

  describe('mapDispatchToProps', () => {
    let dispatch, gaSpy;
    beforeEach(() => {
      dispatch = jest.fn();
      gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('hooks into changeDateInterval', () => {
      mapDispatchToProps(dispatch).onInterval({
        target: {
          value: 'foo date',
        },
      });
      expect(dispatch.mock.calls.length).toEqual(1);
      expect(gaSpy).toHaveBeenCalledWith('Dropdown', 'Trends:foo date');
    });
    it('hooks into changeDataLens', () => {
      mapDispatchToProps(dispatch).onLens({
        target: {
          value: 'foo lens',
        },
      });
      expect(dispatch.mock.calls.length).toEqual(1);
      expect(gaSpy).toHaveBeenCalledWith('Dropdown', 'Trends:foo lens');
    });

    it('hooks into dismissWarning', () => {
      mapDispatchToProps(dispatch).onDismissWarning();
      expect(dispatch.mock.calls).toEqual([
        [
          {
            requery: 'REQUERY_NEVER',
            type: 'TRENDS_DATE_WARNING_DISMISSED',
          },
        ],
      ]);
    });
  });
});
