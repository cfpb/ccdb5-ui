import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ReduxSimpleFilter from '../SimpleFilter';
import { SimpleFilter, mapDispatchToProps } from '../SimpleFilter';
import renderer from 'react-test-renderer';

function setupEnzyme() {
  const props = {
    fieldName: 'timely',
    showChildren: false,
    options: []
  }

  const target = shallow(<SimpleFilter {...props} />);

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

describe('componentWillReceiveProps', () => {
  it('changes props correctly', () => {
    const {target} = setupEnzyme()
    target.setProps({showChildren: true})
    expect(target.state('showChildren')).toEqual(true)
  });
});
