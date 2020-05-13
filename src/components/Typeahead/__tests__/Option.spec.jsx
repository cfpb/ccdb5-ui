import React from 'react'
import renderer from 'react-test-renderer'
import Option from '../Option'

describe('component::Option', () => {
  it('looks different when selected', () => {
    const target = renderer.create(
      <Option selected={true} onClick={jest.fn()} />
    )

    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
