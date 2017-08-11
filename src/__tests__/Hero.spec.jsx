import Hero, { mapDispatchToProps } from '../Hero'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
  })

  return renderer.create(
    <Provider store={store}>
      <Hero />
    </Provider>
  )
}

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot()
    let tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('hooks into showMoreAboutDialog', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).onMoreAbout()
    expect(dispatch.mock.calls.length).toEqual(1)
  })
})