import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer'
import ReduxAggregationBranch, {
  AggregationBranch, mapDispatchToProps
} from '../AggregationBranch'
import { slugify } from '../utils'

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

function setupEnzyme(active=false, refElem=null) {
  const props = {
    active,
    indeterminate: false,
    item: item,
    subitems: subitems,
    fieldName: "issue",
    checkParent: jest.fn(),
    uncheckParent: jest.fn()
  }

  const target = shallow(<AggregationBranch {...props} />)

  // Fake the `ref` call
  target.instance()._setReference(refElem)

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
      issue: [slugify('foo', 'bar')]
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

      expect(target.state('showChildren')).toEqual(false)
      theButton.simulate('click')
      expect(target.state('showChildren')).toEqual(true)
    })
  })

  describe('parent checkbox logic', () => {
    it('calls one action when the checkbox is already selected', () => {
      const { target, props } = setupEnzyme(true)
      const checkbox = target.find('li.parent input[type="checkbox"]')
      checkbox.simulate('change')
      expect(props.uncheckParent).toHaveBeenCalledWith(
        'issue', ['foo', 'foo•bar', 'foo•baz', 'foo•qaz']
      )
      expect(props.checkParent).not.toHaveBeenCalled()
    })

    it('calls another action when the checkbox is not selected', () => {
      const { target, props } = setupEnzyme()
      const checkbox = target.find('li.parent input[type="checkbox"]')
      checkbox.simulate('change')
      expect(props.uncheckParent).not.toHaveBeenCalled()
      expect(props.checkParent).toHaveBeenCalledWith(
        'issue', ['foo', 'foo•bar', 'foo•baz', 'foo•qaz']
      )
    })

    it('displays indeterminate when at least one child is checked', () => {
      const spyElem = {}
      const { target, props } = setupEnzyme(false, spyElem)
      target.setProps({ indeterminate: true })

      // Fake componentDidUpdate since it is not called for shallow renders
      // https://github.com/airbnb/enzyme/issues/465
      target.instance().componentDidUpdate()

      expect(spyElem.indeterminate).toEqual(true)
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into addMultipleFilters', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).checkParent({
        fieldName: 'foo',
        values: ['bar', 'baz']
      })
      expect(dispatch.mock.calls.length).toEqual(1)
    })

    it('hooks into removeMultipleFilters', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).uncheckParent({
        fieldName: 'foo',
        values: ['bar', 'baz']
      })
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})
