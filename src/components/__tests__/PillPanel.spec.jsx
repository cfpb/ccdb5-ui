import React from 'react'
import { PillPanel } from '../Search/PillPanel'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer'


function setupSnapshot( initialQueryState = {}, initialAggState = {} ) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    aggs: initialAggState,
    query: initialQueryState
  })

  return renderer.create(
    <Provider store={store}>
      <PillPanel />
    </Provider>
  )
}

describe('component:PillPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot({
      company: ['Apples', 'Bananas are great'],
      timely: ['Yes']
    });
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it( 'does not renders patched filters', () => {
    const aggs = {
      issue: [
        {
          key: 'a',
          'sub_issue.raw': {
            buckets: [ { key: 'b' }, { key: 'c' }, { key: 'd' } ]
          }
        }
      ]
    }
    const target = setupSnapshot( {
      issue: [ 'a', 'Bananas are great' ]
    }, aggs )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it('does not render when there are no filters', () => {
    const target = setupSnapshot();
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('adds a has narrative pill', () => {
    const target = setupSnapshot({
      has_narrative: true
    });
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  // TODO: rewrite tests for redux actions

})
