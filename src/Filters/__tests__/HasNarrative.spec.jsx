import ReduxHasNarrative, { HasNarrative, mapDispatchToProps } from '../HasNarrative'
import configureMockStore from 'redux-mock-store'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    toggleFlagFilter: jest.fn(),
    isChecked: true
  }, initialProps)

  const target = mount(<HasNarrative {...props} />);

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
  describe('flag filter changed', () => {
    it('triggers an update when checkbox is clicked', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('#filterHasNarrative')
      input.simulate('change')
      expect(props.toggleFlagFilter).toHaveBeenCalled()
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into toggleFlagFilter', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).toggleFlagFilter('foo')
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})