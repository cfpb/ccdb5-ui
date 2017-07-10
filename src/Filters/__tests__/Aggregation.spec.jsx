import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import ReduxAggregation, { Aggregation } from '../Aggregation';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

const fixture = [
  {key: 'alpha', doc_count: 99},
  {key: 'beta', doc_count: 99},
  {key: 'gamma', doc_count: 99},
  {key: 'delta', doc_count: 99},
  {key: 'epsilon', doc_count: 99},
  {key: 'zeta', doc_count: 99},
  {key: 'eta', doc_count: 99},
  {key: 'theta', doc_count: 99}
];

function setupEnzyme(initial) {
  const props = {
    options: initial
  }

  const target = shallow(<Aggregation {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot(initialAggs) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {},
    aggs: {
      company_response: initialAggs
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxAggregation fieldName="company_response"/>
      </IntlProvider>
    </Provider>
  )
}

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot([
      {key: 'foo', doc_count: 99}
    ]);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('show more and less', () => {
  it('only shows the first 6 items of large arrays', () => {
    const target = setupSnapshot(fixture);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('expects showAll to start false and toggle all bool states', () => {
    const { target } = setupEnzyme(fixture)
    // Initial state should be false
    expect(target.state().showMore).toEqual(false);
    target.instance()._toggleShowMore();
    expect(target.state().showMore).toEqual(true);
    target.instance()._toggleShowMore();
    expect(target.state().showMore).toEqual(false);
  })
})
