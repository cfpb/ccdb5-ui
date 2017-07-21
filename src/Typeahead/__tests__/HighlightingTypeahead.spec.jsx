import { shallow } from 'enzyme';
import React from 'react'
import HighlightingTypeahead from '../HighlightingTypeahead'
import renderer from 'react-test-renderer'

function setupEnzyme() {
  const props = {
    options: ['Foo', 'Bar', 'Baz', 'Qaz', 'Quux', 'Nuux'],
    onOptionSelected: jest.fn()
  }

  const target = shallow(<HighlightingTypeahead {...props} />);

  return {
    props,
    target
  }
}

describe('component::HighlightingTypeahead', () => {
  describe('_onInputChange', () => {
    it('produces a custom array of matches', () => {
      const {target} = setupEnzyme()
      const actual = target.instance()._onInputChange('BA')
      expect(actual.length).toEqual(2)
    })
  })

  describe('_renderOption', () => {
    it('produces a custom component', () => {
      const {target} = setupEnzyme()
      const options = target.instance()._onInputChange('FOO')
      const actual = target.instance()._renderOption(options[0])
      expect(actual).toEqual({
        value: 'Foo',
        component: expect.anything()
      })
    })
  })
})
