import React from 'react'
import DataExport from '../DataExport'
import renderer from 'react-test-renderer'

describe('component::DataExport', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = renderer.create(
        <DataExport />
      )

      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
