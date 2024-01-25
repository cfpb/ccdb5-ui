import configureMockStore from 'redux-mock-store';
import ReduxStackedAreaChart, {
  mapDispatchToProps,
  mapStateToProps,
  StackedAreaChart,
} from '../Charts/StackedAreaChart';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';

// this is how you override and mock an imported constructor
jest.mock('britecharts', () => {
  const props = [
    'stackedArea',
    'margin',
    'initializeVerticalMarker',
    'colorSchema',
    'dateLabel',
    'tooltipThreshold',
    'grid',
    'aspectRatio',
    'isAnimated',
    'on',
    'yAxisPaddingBetweenChart',
    'width',
    'height',
    'areaCurve',
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
 */
function setupSnapshot() {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = {
    query: {
      dateInterval: 'Month',
      date_received_min: '2012',
      date_received_max: '2014',
    },
    trends: {
      colorMap: {
        foo: '#fff',
        bar: '#eee',
      },
      lastDate: '2014-01-01',
      lens: 'Overview',
      results: {
        dateRangeArea: [1, 2, 3],
      },
      tooltip: false,
    },
    view: {
      isPrintMode: false,
      width: 1000,
    },
  };
  const store = mockStore(state);
  return renderer.create(
    <Provider store={store}>
      <ReduxStackedAreaChart />
    </Provider>,
  );
}

describe('component: StackedAreaChart', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot();
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('componentDidUpdate', () => {
    let mapDiv;

    beforeEach(() => {
      mapDiv = document.createElement('div');
      mapDiv.setAttribute('id', 'stacked-area-chart-foo');
      window.domNode = mapDiv;
      document.body.appendChild(mapDiv);
    });

    afterEach(() => {
      const div = document.getElementById('stacked-area-chart-foo');
      if (div) {
        document.body.removeChild(div);
      }
      jest.clearAllMocks();
    });

    it('does nothing when no data', () => {
      const target = shallow(
        <StackedAreaChart colorMap={{ foo: 'bar' }} data={[]} />,
      );
      target._redrawChart = jest.fn();
      target.setProps({ data: [] });
      expect(target._redrawChart).toHaveBeenCalledTimes(0);
    });

    it('trigger a new update when data changes', () => {
      const target = shallow(
        <StackedAreaChart
          tooltipUpdated={jest.fn()}
          colorMap={{ foo: 'bar', shi: 'oio' }}
          data={[23, 4, 3]}
          dateRange={{ from: '1/1/2021', to: '1/1/2022' }}
          interval="Month"
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ data: [2, 5] });
      expect(sp).toHaveBeenCalledTimes(1);
    });

    it('trigger a new update when isPrintMode changes', () => {
      const target = shallow(
        <StackedAreaChart
          tooltipUpdated={jest.fn()}
          colorMap={{ foo: 'bar', shi: 'oio' }}
          data={[23, 4, 3]}
          dateRange={{ from: '1/1/2021', to: '1/1/2022' }}
          interval="Month"
          isPrintMode={false}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ isPrintMode: true });
      expect(sp).toHaveBeenCalledTimes(1);
    });

    it('trigger a new update when width changes', () => {
      const target = shallow(
        <StackedAreaChart
          tooltipUpdated={jest.fn()}
          colorMap={{ foo: 'bar', shi: 'oio' }}
          data={[23, 4, 3]}
          dateRange={{ from: '1/1/2021', to: '1/1/2022' }}
          interval="Month"
          isPrintMode={false}
          width={1000}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ width: 600 });
      expect(sp).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapDispatchToProps', () => {
    it('provides a way to call updateTrendsTooltip', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).tooltipUpdated('foo');
      expect(dispatch.mock.calls).toEqual([
        [
          {
            requery: 'REQUERY_NEVER',
            type: 'TRENDS_TOOLTIP_CHANGED',
            value: 'foo',
          },
        ],
      ]);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        query: {
          dateInterval: 'Month',
          date_received_min: '',
          date_received_max: '',
        },
        trends: {
          colorMap: {},
          lens: 'Overview',
          results: {
            dateRangeArea: [],
          },
          tooltip: {},
        },
        view: {
          isPrintMode: false,
          width: 1000,
        },
      };

      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        colorMap: {},
        data: [],
        dateRange: {
          from: '',
          to: '',
        },
        filteredData: [],
        interval: 'Month',
        lens: 'Overview',
        isPrintMode: false,
        hasChart: false,
        tooltip: {},
        width: 1000,
      });
    });
  });

  describe('tooltip events', () => {
    let target, cb;

    beforeEach(() => {
      cb = jest.fn();
    });

    xit('updates external tooltip with different data', () => {
      target = shallow(
        <StackedAreaChart
          colorMap={{ a: '#eee', b: '#444' }}
          data={[2, 3, 4]}
          interval="Month"
          dateRange={{
            from: '2012',
            to: '2020',
          }}
          filteredData={[2, 3, 4]}
          tooltip={{ date: '2000' }}
          tooltipUpdated={cb}
          hasChart={true}
        />,
      );
      const instance = target.instance();
      instance._updateTooltip({ date: '2012', values: [1, 2, 3] });
      expect(cb).toHaveBeenCalledTimes(2);
    });

    xit('Only updates external tooltip on init', () => {
      target = shallow(
        <StackedAreaChart
          colorMap={{ a: '#eee', b: '#444' }}
          data={[3, 5, 6]}
          interval="Month"
          dateRange={{
            from: '2012',
            to: '2020',
          }}
          filteredData={[2, 3, 4]}
          tooltip={{ date: '2000' }}
          tooltipUpdated={cb}
          hasChart={true}
        />,
      );
      const instance = target.instance();
      instance._updateTooltip({ date: '2000', value: 200 });
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });
  describe('helpers', () => {
    describe('_chartWidth', () => {
      it('gets print width', () => {
        const target = shallow(
          <StackedAreaChart
            isPrintMode={true}
            colorMap={{ a: '#eee', b: '#444' }}
            lens="Overview"
            data={[3, 5, 6]}
            interval="Month"
            dateRange={{
              from: '2012',
              to: '2020',
            }}
            tooltipUpdated={jest.fn()}
          />,
        );
        expect(target.instance()._chartWidth('#foo')).toEqual(500);
      });
    });
  });
});
