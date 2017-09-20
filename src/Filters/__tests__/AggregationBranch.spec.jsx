import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer'
import ReduxAggregationBranch, {
  AggregationBranch, CHECKED, mapDispatchToProps, UNCHECKED
} from '../AggregationBranch'
import { slugify } from '../../utils'

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

function setupEnzyme(checkedState=UNCHECKED) {
  const props = {
    checkedState,
    checkParent: jest.fn(),
    fieldName: "issue",
    item: item,
    subitems: subitems,
    uncheckParent: jest.fn()
  }

  const target = shallow(<AggregationBranch {...props} />)

  return {
    props,
    target
  }
}

function setupSnapshot(selections) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {
      issue: selections
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
  describe('snapshots', () => {
    it('renders with all checked', () => {
      const selections = [
        'foo',
        slugify('foo', 'bar'),
        slugify('foo', 'baz'),
        slugify('foo', 'qaz'),
      ]
      const target = setupSnapshot(selections)
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders with indeterminate', () => {
      const selections = [slugify('foo', 'bar')]
      const target = setupSnapshot(selections)
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders with none checked', () => {
      const target = setupSnapshot( [] )
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

  })

  describe('toggle behavior', () => {
    it('shows the children when the label is clicked', () => {
      const { target, props } = setupEnzyme()
      const theButton = target.find('button')

      expect(target.state('showChildren')).toEqual(false)
      theButton.simulate('click')
      expect(target.state('showChildren')).toEqual(true)
    })
  })

  describe('parent checkbox logic', () => {
    it('calls one action when the checkbox is already selected', () => {
      const { target, props } = setupEnzyme(CHECKED)
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
