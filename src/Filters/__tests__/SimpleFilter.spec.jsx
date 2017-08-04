import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import ReduxSimpleFilter from '../SimpleFilter';
import { SimpleFilter, mapDispatchToProps } from '../SimpleFilter';
import renderer from 'react-test-renderer';

function setupSnapshot(initialAggs) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {},
    aggs: {
      company_response: initialAggs,
      timely: 'yes'
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxSimpleFilter fieldName="company_response"/>
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

describe('component:SimpleFilter', () =>{
  let target;
  let props;
  beforeEach(() => {
    props = {
      params: {
        timely: 'yes'
      }
    }

   target = new SimpleFilter(props);
  });

  describe('componentWillReceiveProps', () => {
    it('changes props correctly', () => {
      props.params.timely = 'no'
      const expected = 'no'

      target.componentWillReceiveProps(props)

      expect(target.props.params.timely).toEqual(expected)
    })
  })
})
