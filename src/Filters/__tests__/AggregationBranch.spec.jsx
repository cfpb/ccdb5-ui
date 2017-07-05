import React from 'react'
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer';
import ReduxAggregationBranch, { AggregationBranch } from '../AggregationBranch'
import { SLUG_SEPARATOR } from '../../constants'

// ----------------------------------------------------------------------------
// Setup 

const item = {
  key: 'foo',
  doc_count: 99
}

const subitems = [
  { key: 'bar', doc_count: 90 },
  { key: 'baz', doc_count: 5 },
  { key: 'qaz', doc_count: 4 },
]

function setupEnzyme() {
  const props = {
    item: item,
    subitems: subitems,
    fieldName: "issue"
  }

  const target = shallow(<AggregationBranch {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {
      issue: ['foo' + SLUG_SEPARATOR + 'bar']
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxAggregationBranch item={item} 
                                subitems={subitems}
                                fieldName="issue" />
      </IntlProvider>
    </Provider>
  )
}

// ----------------------------------------------------------------------------
// Test 

describe('component::AggregationBranch', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('toggle behavior', () => {
    it('shows the children when the label is clicked', () => {
      const { target, props } = setupEnzyme()
      const theButton = target.find('.toggle button')

      expect(target.state('showChildren')).toEqual(false);
      theButton.simulate('click');
      expect(target.state('showChildren')).toEqual(true);
    })  
  })
})
