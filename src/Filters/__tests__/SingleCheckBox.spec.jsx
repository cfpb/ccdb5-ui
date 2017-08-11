import ReduxSingleCheckbox, { SingleCheckbox, mapDispatchToProps } from '../SingleCheckbox'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    changeFlagFilter: jest.fn(),
    fieldName: 'has_narrative',
    isChecked: true
  }, initialProps)

  const target = shallow(<SingleCheckbox {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot(query={}) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query
  })

  return renderer.create(
    <Provider store={store}>
      <ReduxSingleCheckbox fieldName="has_narrative" />
    </Provider>
  )
}

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  });

  it('pre-check filter based on query', () => {
      const target = setupSnapshot({
        has_narrative: true
      })
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
});

describe('component::SingleCheckbox', () => {
  describe('componentWillReceiveProps', () => {
    it('does not trigger a new update', () => {
      const {target, props} = setupEnzyme()
      target.setProps({ has_narrative: true })
      expect(props.changeFlagFilter).not.toHaveBeenCalled()
    })    
  })

  describe('flag filter changed', () => {
    it('triggers an update when checkbox is clicked', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input[id="theCheckbox"]')

      input.simulate('click')
      const actual = props.changeFlagFilter.mock.calls[0]

      expect(actual[0]).toEqual('has_narrative')
      expect(actual[1]).toEqual(false)
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into changeFlagFilter', () => {
      const dispatch = jest.fn()
      const props = {fieldName: 'qaz'}
      mapDispatchToProps(dispatch, props).changeFlagFilter('foo', 'bar')
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})