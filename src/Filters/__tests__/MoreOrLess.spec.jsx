import React from 'react'
import { shallow } from 'enzyme'
import Aggregationitem from '../AggregationItem'
import MoreOrLess from '../MoreOrLess'

const fixture = [
  {key: 'alpha', doc_count: 99},
  {key: 'beta', doc_count: 99},
  {key: 'gamma', doc_count: 99},
  {key: 'delta', doc_count: 99},
  {key: 'epsilon', doc_count: 99},
  {key: 'zeta', doc_count: 99},
  {key: 'eta', doc_count: 99},
  {key: 'theta', doc_count: 99}
]

function setupEnzyme(initial) {
  const props = {
    listComponent: Aggregationitem,
    options: initial
  }

  const target = shallow(<MoreOrLess {...props} />)

  return {
    props,
    target
  }
}

describe('component:MoreOrLess', () => {
  it('expects showAll to start false and toggle all bool states', () => {
    const { target } = setupEnzyme(fixture)
    // Initial state should be false
    expect(target.state().showMore).toEqual(false)
    target.instance()._toggleShowMore()
    expect(target.state().showMore).toEqual(true)
    target.instance()._toggleShowMore()
    expect(target.state().showMore).toEqual(false)
  })
})
