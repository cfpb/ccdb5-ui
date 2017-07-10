import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import Aggregation from '../Aggregation';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

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
        <Aggregation fieldName="company_response"/>
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

describe('show more', () => {
  let target;
  beforeEach(() => {
    target = setupSnapshot([
      {key: 'alpha', doc_count: 99},
      {key: 'beta', doc_count: 99},
      {key: 'gamma', doc_count: 99},
      {key: 'delta', doc_count: 99},
      {key: 'epsilon', doc_count: 99},
      {key: 'zeta', doc_count: 99},
      {key: 'eta', doc_count: 99},
      {key: 'theta', doc_count: 99}
    ]);
  })
  it('only shows the first 6 items of large arrays', () => {
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })
  it('expects a default showAll state of false', () => {
    const wrapper = shallow(<CollapsibleFilter />)
    console.log('WRAPPER STATE: ', wrapper.state);

  })
})
