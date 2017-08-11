import MoreAbout from '../MoreAbout'
import React from 'react'
import renderer from 'react-test-renderer'

describe('component::MoreAbout', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = renderer.create(
        <MoreAbout />
      )

      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
