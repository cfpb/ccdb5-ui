import React from 'react'
import renderer from 'react-test-renderer'
import AdvancedTips from '../AdvancedTips'

function setupSnapshot() {
  return renderer.create(
      <AdvancedTips />
  )
}

describe('component::AdvancedTips', () => {
  describe('initial state', () => {
    it('renders HTML', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
