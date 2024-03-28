import configureMockStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import ReduxTrendDepthToggle, {
  TrendDepthToggle,
  mapDispatchToProps,
  mapStateToProps,
} from '../Trends/TrendDepthToggle';
import React from 'react';
import renderer from 'react-test-renderer';
import { REQUERY_ALWAYS } from '../../constants';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';

/**
 *
 * @param {object} root0 - Root state
 * @param {number} root0.cbIncrease - Amount of depth increase
 * @param {boolean} root0.cbReset - Rest the depth?
 * @param {number} root0.diff - Difference
 * @param {number} root0.queryCount - Query count
 * @param {number} root0.resultCount - Query count
 * @returns {React.Component} - Trends Depth Toggle component
 */
function setupEnzyme({ cbIncrease, cbReset, diff, queryCount, resultCount }) {
  return shallow(
    <TrendDepthToggle
      diff={diff}
      increaseDepth={cbIncrease}
      lens="Product"
      depthReset={cbReset}
      queryCount={queryCount}
      resultCount={resultCount}
      hasToggle={true}
    />,
  );
}

/**
 *
 * @param {object} root0 - Root state
 * @param {string} root0.focus - The focus
 * @param {string} root0.lens - The lens
 * @param {object} root0.productAggs - Product aggs
 * @param {object} root0.productResults - Product results
 * @returns {Function} - Trends Depth Toggle component renderer
 */
function setupSnapshot({ focus, lens, productAggs, productResults }) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    aggs: {
      product: productAggs,
    },
    query: {
      focus,
      lens,
    },
    trends: {
      results: {
        product: productResults,
      },
    },
  });

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxTrendDepthToggle />
      </IntlProvider>
    </Provider>,
  );
}

describe('component:TrendDepthToggle', () => {
  let params;

  beforeEach(() => {
    params = {
      focus: '',
      lens: '',
      productAggs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      productResults: [
        { name: 'a', visible: true },
        { name: 'b', visible: true },
        { name: 'c', visible: true },
        { name: 'd', visible: true },
        { name: 'e', visible: true },
        { name: 'f', visible: true },
        { name: 'g', visible: true },
        { name: 'h', visible: true },
      ],
    };
  });

  it('does not render when Focus', () => {
    params.focus = 'A focus item';
    const target = setupSnapshot(params);
    const tree = target.toJSON();
    expect(tree).toBeNull();
  });

  it('does not render lens is not Product', () => {
    params.lens = 'Cannot See';
    const target = setupSnapshot(params);
    const tree = target.toJSON();
    expect(tree).toBeNull();
  });

  it('renders Product view more without crashing', () => {
    params.lens = 'Product';
    const target = setupSnapshot(params);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders Product view less without crashing', () => {
    params.lens = 'Product';
    params.productAggs = [1, 2, 3, 4, 5];
    params.productResults = [
      { name: 'a', visible: true, isParent: true },
      { name: 'b', visible: true, isParent: true },
      { name: 'c', visible: true, isParent: true },
      { name: 'd', visible: true, isParent: true },
      { name: 'e', visible: true, isParent: true },
      { name: 'f', visible: true, isParent: true },
      { name: 'g', visible: true, isParent: true },
      { name: 'h', visible: true, isParent: true },
    ];
    const target = setupSnapshot(params);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('buttons', () => {
    let cbIncrease = null;
    let cbReset = null;
    let target;

    beforeEach(() => {
      cbIncrease = jest.fn();
      cbReset = jest.fn();
    });

    it('increaseDepth is called when the increase button is clicked', () => {
      target = setupEnzyme({
        cbIncrease,
        cbReset,
        diff: 1000,
        resultCount: 5,
      });
      const prev = target.find('#trend-depth-button');
      prev.simulate('click');
      expect(cbIncrease).toHaveBeenCalledWith(1000);
    });

    it('reset depth is called when the reset button is clicked', () => {
      target = setupEnzyme({
        cbIncrease,
        cbReset,
        diff: 0,
        queryCount: 10,
        resultCount: 10,
      });
      const prev = target.find('#trend-depth-button');
      prev.simulate('click');
      expect(cbReset).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into changeDepth', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).increaseDepth(13);
      expect(dispatch.mock.calls).toEqual([
        [
          {
            meta: {
              requery: REQUERY_ALWAYS,
            },
            type: 'query/changeDepth',
            payload: { depth: 18 },
          },
        ],
      ]);
    });

    it('hooks into resetDepth', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).depthReset();
      expect(dispatch.mock.calls).toEqual([
        [
          {
            meta: {
              requery: REQUERY_ALWAYS,
            },
            type: 'query/resetDepth',
          },
        ],
      ]);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        aggs: {
          product: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        query: {
          focus: '',
          lens: 'Product',
        },
        trends: {
          results: {
            product: [
              { name: 'a', visible: true },
              {
                name: 'b',
                visible: true,
              },
              { name: 'c', visible: true },
              { name: 'd', visible: true },
              { name: 'e', visible: true },
              { name: 'f', visible: true },
              { name: 'g', visible: true },
              { name: 'h', visible: true },
            ],
          },
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        diff: 11,
        queryCount: 11,
        resultCount: 0,
        hasToggle: true,
      });
    });

    describe('when lens = Company', () => {
      let state;
      beforeEach(() => {
        state = {
          aggs: {},
          query: {
            focus: '',
            lens: 'Company',
            company: [
              'I',
              'I',
              'III',
              'IV',
              'V',
              'VI',
              'VII',
              'VIII',
              'IX',
              'X',
              'XI',
            ],
          },
          trends: {
            results: {
              company: [
                { name: 'a', visible: true },
                { name: 'b', visible: true },
                { name: 'c', visible: true },
                { name: 'd', visible: true },
                { name: 'e', visible: true },
                { name: 'f', visible: true },
                { name: 'g', visible: true },
                { name: 'h', visible: true },
                { name: 'i', visible: true },
                { name: 'j', visible: true },
              ],
            },
          },
        };
      });

      it('caps the maximum number of companies at 10', () => {
        const actual = mapStateToProps(state);
        expect(actual).toEqual({
          diff: 10,
          queryCount: 11,
          resultCount: 0,
          hasToggle: true,
        });
      });

      it('shows the toggle when results < 10', () => {
        state.trends.results.company.splice(4, 5);

        const actual = mapStateToProps(state);
        expect(actual).toEqual({
          diff: 10,
          queryCount: 11,
          resultCount: 0,
          hasToggle: true,
        });
      });

      it('hides the toggle when only parent count < 5 item', () => {
        state.query.company = ['a'];
        state.trends.results.company = [
          { name: 'a', visible: true, isParent: true },
          { name: 'b', visible: true, isParent: false },
          { name: 'c', visible: true, isParent: false },
          { name: 'd', visible: true, isParent: false },
          { name: 'e', visible: true, isParent: false },
          { name: 'f', visible: true, isParent: false },
          { name: 'g', visible: true, isParent: false },
          { name: 'h', visible: true, isParent: false },
          { name: 'i', visible: true, isParent: false },
          { name: 'j', visible: true, isParent: false },
        ];

        const actual = mapStateToProps(state);
        expect(actual).toEqual({
          diff: 0,
          queryCount: 1,
          resultCount: 1,
          hasToggle: false,
        });
      });
    });
  });
});
