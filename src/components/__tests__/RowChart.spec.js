import * as trendsUtils from '../../utils/trends';
import configureMockStore from 'redux-mock-store';
import ReduxRowChart, {
  mapDispatchToProps,
  mapStateToProps,
  RowChart,
} from '../Charts/RowChart';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';
import * as utils from '../../utils';

// this is how you override and mock an imported constructor
jest.mock('britecharts', () => {
  const props = [
    'row',
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
    'miniTooltip',
    'yAxisPaddingBetweenChart',
    'width',
    'wrapLabels',
    'height',
    'on',
    'valueFormatter',
    'paddingBetweenGroups',
  ];

  const mock = {};

  for (let idx = 0; idx < props.length; idx++) {
    const propName = props[idx];
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
    'on',
  ];

  const mock = {};

  for (let idx = 0; idx < props.length; idx++) {
    const propName = props[idx];
    mock[propName] = jest.fn().mockImplementation(() => {
      return mock;
    });
  }

  // set narrow width value for 100% test coverage
  mock.width = 100;

  return mock;
});

/**
 * @returns {void}
 */
function setupSnapshot() {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    aggs: {},
    query: {
      lens: 'bar',
      tab: 'foo',
    },
    view: {
      expandedRows: [],
      isPrintMode: false,
      width: 1000,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <ReduxRowChart
        id="foo"
        data={[1, 2, 3]}
        title="Foo title we want"
        helperText="sub title under title"
        colorScheme={[]}
        total={1000}
      />
    </Provider>,
  );
}

describe('component: RowChart', () => {
  describe('initial state', () => {
    xit('renders without crashing', () => {
      const target = setupSnapshot();
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('componentDidUpdate', () => {
    let mapDiv;

    beforeEach(() => {
      mapDiv = document.createElement('div');
      mapDiv.setAttribute('id', 'row-chart-foo');
      window.domNode = mapDiv;
      document.body.appendChild(mapDiv);
    });

    afterEach(() => {
      const div = document.getElementById('row-chart-foo');
      if (div) {
        document.body.removeChild(div);
      }
      jest.clearAllMocks();
    });

    it('does nothing when no data', () => {
      const target = shallow(
        <RowChart colorScheme={[]} data={[]} id="foo" title="test" total={0} />,
      );
      target._redrawChart = jest.fn();
      target.setProps({ data: [] });
      expect(target._redrawChart).toHaveBeenCalledTimes(0);
    });

    xit('trigger a new update when data changes', () => {
      const target = shallow(
        <RowChart
          colorScheme={[]}
          title="test"
          data={[
            23,
            4,
            3,
            { name: 'More Information about xy', value: 10 },
            { name: 'Athing about xy', value: 10 },
          ]}
          id="foo"
          total={1000}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ data: [2, 5] });
      expect(sp).toHaveBeenCalledTimes(1);
    });

    xit('trigger a new update when isPrintMode changes', () => {
      const target = shallow(
        <RowChart
          colorScheme={[]}
          title="test"
          data={[
            { name: 'fOO', value: 1 },
            { name: 'fO1', value: 1 },
            {
              name: 'Visualize trends for fOO',
              value: 1,
            },
          ]}
          id="foo"
          total={1000}
          isPrintMode={false}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ isPrintMode: true });
      expect(sp).toHaveBeenCalledTimes(1);
    });

    xit('trigger a new update when width changes', () => {
      const target = shallow(
        <RowChart
          colorScheme={[]}
          title="test"
          data={[23, 4, 3]}
          id="foo"
          total={1000}
          isPrintMode={false}
          width={1000}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ width: 600 });
      expect(sp).toHaveBeenCalledTimes(1);
    });

    xit('calls select Focus with a lens', () => {
      const cb = jest.fn();
      const target = shallow(
        <RowChart
          aggs={{ product: [1, 2, 3] }}
          selectFocus={cb}
          colorScheme={[]}
          title="test"
          lens="Product"
          data={[23, 4, 3]}
          id="foo"
          total={1000}
        />,
      );
      target.instance()._selectFocus({ name: 'foo' });
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith({ name: 'foo' }, 'Product', [1, 2, 3]);
    });

    xit('calls select Focus with product lens - Overview', () => {
      const cb = jest.fn();
      const target = shallow(
        <RowChart
          aggs={{ product: [1, 2, 3] }}
          lens="Overview"
          selectFocus={cb}
          colorScheme={[]}
          title="test"
          data={[23, 4, 3]}
          id="foo"
          total={1000}
        />,
      );
      target.instance()._selectFocus({ name: 'foo' });
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith({ name: 'foo' }, 'Product', [1, 2, 3]);
    });

    describe('row toggles', () => {
      let expandCb, collapseCb;
      beforeEach(() => {
        collapseCb = jest.fn();
        expandCb = jest.fn();
      });

      xit('collapses a row', () => {
        const target = shallow(
          <RowChart
            lens="Overview"
            collapseRow={collapseCb}
            expandRow={expandCb}
            colorScheme={[]}
            title="test"
            data={[{ name: 'a', isParent: true }]}
            expandedRows={['a']}
            id="foo"
            total={1000}
          />,
        );
        target.instance()._toggleRow('a');
        expect(collapseCb).toHaveBeenCalledTimes(1);
        expect(collapseCb).toHaveBeenCalledWith('a');
        expect(expandCb).toHaveBeenCalledTimes(0);
      });

      xit('expands a row', () => {
        const target = shallow(
          <RowChart
            lens="Overview"
            collapseRow={collapseCb}
            expandRow={expandCb}
            colorScheme={[]}
            title="test"
            data={[{ name: 'a', isParent: true }]}
            expandedRows={[]}
            id="foo"
            total={1000}
          />,
        );
        target.instance()._toggleRow('a');
        expect(expandCb).toHaveBeenCalledTimes(1);
        expect(expandCb).toHaveBeenCalledWith('a');
        expect(collapseCb).toHaveBeenCalledTimes(0);
      });

      xit('ignores non-parent rows', () => {
        const target = shallow(
          <RowChart
            lens="Overview"
            collapseRow={collapseCb}
            expandRow={expandCb}
            colorScheme={[]}
            title="test"
            data={[{ name: 'a', isParent: false }]}
            expandedRows={[]}
            id="foo"
            total={1000}
          />,
        );
        target.instance()._toggleRow('a');
        expect(expandCb).toHaveBeenCalledTimes(0);
        expect(collapseCb).toHaveBeenCalledTimes(0);
      });
    });
  });

  xdescribe('mapDispatchToProps', () => {
    let dispatch, gaSpy;
    beforeEach(() => {
      dispatch = jest.fn();
      gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('hooks into changeFocus', () => {
      jest.spyOn(trendsUtils, 'scrollToFocus');
      const filters = [
        {
          key: 'A',
          'sub_product.raw': {
            buckets: [{ key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }],
          },
        },
        {
          key: 'Debt collection',
          'sub_product.raw': {
            buckets: [
              { key: 'Other debt' },
              { key: 'Credit card debt' },
              { key: 'I do not know' },
              { key: 'Medical debt' },
              { key: 'Auto debt' },
              { key: 'Payday loan debt' },
            ],
          },
        },
      ];

      const element = {
        name: 'Visualize trends for A',
        parent: 'A',
      };
      mapDispatchToProps(dispatch).selectFocus(element, 'Product', filters);
      expect(dispatch.mock.lastCall).toEqual([
        [
          {
            payload: {
              filterValues: ['A', 'A•B', 'A•C', 'A•D', 'A•E'],
              focus: 'A',
              lens: 'Product',
            },
            meta: {
              requery: 'REQUERY_ALWAYS',
            },
            type: 'query/changeFocus',
          },
        ],
      ]);
      expect(trendsUtils.scrollToFocus).toHaveBeenCalled();
      expect(gaSpy).toHaveBeenCalledWith('Trends click', 'A');
    });

    it('hooks into changeFocus - no filter found', () => {
      jest.spyOn(trendsUtils, 'scrollToFocus');
      const filters = [
        {
          key: 'Debt collection',
          'sub_product.raw': {
            buckets: [
              { key: 'Other debt' },
              { key: 'Credit card debt' },
              { key: 'I do not know' },
              { key: 'Medical debt' },
              { key: 'Auto debt' },
              { key: 'Payday loan debt' },
            ],
          },
        },
      ];

      const element = {
        name: 'Visualize trends for A',
        parent: 'A',
      };
      mapDispatchToProps(dispatch).selectFocus(element, 'Product', filters);
      expect(dispatch.mock.lastCall).toEqual([
        [
          {
            payload: {
              filterValues: [],
              focus: 'A',
              lens: 'Product',
            },
            meta: {
              requery: 'REQUERY_ALWAYS',
            },
            type: 'query/changeFocus',
          },
        ],
      ]);
      expect(trendsUtils.scrollToFocus).toHaveBeenCalled();
      expect(gaSpy).toHaveBeenCalledWith('Trends click', 'A');
    });

    it('hooks into changeFocus - Company', () => {
      jest.spyOn(trendsUtils, 'scrollToFocus');
      const filters = [{ key: 'Acme' }, { key: 'Beta' }];

      const element = {
        name: 'Visualize trends for Acme',
        parent: 'Acme',
      };
      mapDispatchToProps(dispatch).selectFocus(element, 'Company', filters);
      expect(dispatch.mock.lastCall).toEqual([
        [
          {
            payload: {
              filterValues: ['Acme'],
              focus: 'Acme',
              lens: 'Company',
            },
            meta: {
              requery: 'REQUERY_ALWAYS',
            },
            type: 'query/changeFocus',
          },
        ],
      ]);
      expect(trendsUtils.scrollToFocus).toHaveBeenCalled();
      expect(gaSpy).toHaveBeenCalledWith('Trends click', 'Acme');
    });

    it('hooks into collapseTrend', () => {
      jest.spyOn(trendsUtils, 'scrollToFocus');
      mapDispatchToProps(dispatch).collapseRow('Some Expanded row');
      expect(dispatch.mock.calls).toEqual([
        [
          {
            meta: {
              requery: 'REQUERY_NEVER',
            },
            type: 'view/collapseRow',
            payload: 'Some Expanded row',
          },
        ],
      ]);
      expect(trendsUtils.scrollToFocus).not.toHaveBeenCalled();
      expect(gaSpy).toHaveBeenCalledWith(
        'Bar chart collapsed',
        'Some Expanded row',
      );
    });

    it('hooks into expandTrend', () => {
      jest.spyOn(trendsUtils, 'scrollToFocus');
      mapDispatchToProps(dispatch).expandRow('collapse row name');
      expect(dispatch.mock.calls).toEqual([
        [
          {
            meta: {
              requery: 'REQUERY_NEVER',
            },
            type: 'view/expandRow',
            payload: 'collapse row name',
          },
        ],
      ]);
      expect(trendsUtils.scrollToFocus).not.toHaveBeenCalled();
      expect(gaSpy).toHaveBeenCalledWith(
        'Bar chart expanded',
        'collapse row name',
      );
    });
  });

  describe('mapStateToProps', () => {
    let state;
    beforeEach(() => {
      state = {
        map: {},
        query: {
          lens: 'Foo',
          tab: 'Map',
        },
        trends: {},
        view: {
          expandedRows: [],
          isPrintMode: false,
          width: 1000,
        },
      };
    });
    it('maps state and props - Map', () => {
      const ownProps = {
        id: 'baz',
      };
      const actual = mapStateToProps(state, ownProps);
      expect(actual).toEqual({
        expandedRows: [],
        lens: 'Product',
        isPrintMode: false,
        tab: 'Map',
        width: 1000,
      });
    });

    it('maps state and props - Other', () => {
      const ownProps = {
        id: 'baz',
      };

      state.query.tab = 'Trends';

      const actual = mapStateToProps(state, ownProps);
      expect(actual).toEqual({
        expandedRows: [],
        lens: 'Foo',
        isPrintMode: false,
        tab: 'Trends',
        width: 1000,
      });
    });
  });

  describe('helper functions', () => {
    xit('gets height based on number of rows', () => {
      const target = mount(
        <RowChart
          colorScheme={[]}
          title="test"
          total={10}
          data={[23, 4, 3]}
          id="foo"
        />,
      );
      let res = target.instance()._getHeight(1);
      expect(res).toEqual(100);
      res = target.instance()._getHeight(5);
      expect(res).toEqual(300);
    });

    xit('formats text of the tooltip', () => {
      const target = mount(
        <RowChart
          colorScheme={[]}
          title="test"
          total={1000}
          data={[23, 4, 3]}
          id="foo"
        />,
      );
      const res = target.instance()._formatTip(100000);
      expect(res).toEqual('100,000 complaints');
    });
  });
});
