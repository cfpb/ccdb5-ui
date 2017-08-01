import React from 'react'
import HighlightingOption from '../HighlightingOption'
import renderer from 'react-test-renderer'

describe('component::HighlightingOption', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = renderer.create(
        <HighlightingOption label="Foobar" position={0} value="foo" />
      )

      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})

