import ReduxHasNarrative, { HasNarrative, mapDispatchToProps } from '../HasNarrative'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    changeFlagFilter: jest.fn(),
    isChecked: true
  }, initialProps)

  const target = shallow(<HasNarrative {...props} />);

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
      <ReduxHasNarrative />
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

  it('checks and disables the filter when searching narratives', () => {
    const target = setupSnapshot({
      searchField: 'complaint_what_happened'
    })
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })
});

describe('component::HasNarrative', () => {
  describe('componentWillReceiveProps', () => {
    it('does not trigger a new update', () => {
      const {target, props} = setupEnzyme()
      target.setProps({ foo: 'bar' })
      expect(props.changeFlagFilter).not.toHaveBeenCalled()
    })
  })

  describe('componentDidUpdate', () => {
    it('does not trigger a new update unless the isChecked property changes', () => {
      const {target, props} = setupEnzyme()
      target.setState({ foo: 'bar' })
      expect(props.changeFlagFilter).not.toHaveBeenCalled()
    })    
  })

  describe('flag filter changed', () => {
    it('triggers an update when checkbox is clicked', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('#theCheckbox')

      input.simulate('click')
      const actual = props.changeFlagFilter.mock.calls[0]

      expect(props.changeFlagFilter).toHaveBeenCalledWith('has_narrative', false)
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into changeFlagFilter', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).changeFlagFilter('foo', 'bar')
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})