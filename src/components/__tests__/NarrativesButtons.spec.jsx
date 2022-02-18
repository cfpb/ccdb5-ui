import ReduxNarrativesButtons, { NarrativesButtons, mapDispatchToProps } from '../RefineBar/NarrativesButtons'
import configureMockStore from 'redux-mock-store'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    toggleFlag: jest.fn(),
    options: {
      isChecked: true,
      phase: ''
    }
  }, initialProps)

  const target = mount(<NarrativesButtons {...props} />);

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
      <ReduxNarrativesButtons />
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

describe('component::NarrativesButtons', () => {
  describe('flag filter toggled', () => {
    it('triggers an update when narratives button is clicked', () => {
      const { target, props } = setupEnzyme()
      const narratives = target.find('#refineToggleNarrativesButton')
      narratives.simulate('click')
      expect(props.toggleFlag).toHaveBeenCalled()
    })

    it('triggers an update when all complaints button is clicked', () => {
      const { target, props } = setupEnzyme()
      const noNarratives = target.find('#refineToggleNoNarrativesButton')
      noNarratives.simulate('click')
      expect(props.toggleFlag).toHaveBeenCalled()
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into toggleFlag', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).toggleFlag()
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})
