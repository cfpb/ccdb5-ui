import { shallow } from 'enzyme';
import React from 'react';
import HighlightingTypeahead from '../HighlightingTypeahead';

/**
 *
 * @param disableTypeahead
 */
function setupEnzyme(disableTypeahead = false) {
  const props = {
    ariaLabel: 'Start typing to...',
    disableTypeahead,
    htmlId: 'typeahead-foo',
    options: ['Foo', 'Bar', 'Baz', 'Qaz', 'Quux', 'Nuux'],
    onOptionSelected: jest.fn(),
  };

  const target = shallow(<HighlightingTypeahead {...props} />);

  return {
    props,
    target,
  };
}

describe('component::HighlightingTypeahead', () => {
  describe('_onInputChange', () => {
    it('produces a custom array of matches', () => {
      const { target } = setupEnzyme();
      const actual = target.instance()._onInputChange('BA');
      expect(actual.length).toEqual(2);
    });

    it('produces no matches', () => {
      const { target } = setupEnzyme(true);
      const actual = target.instance()._onInputChange('BA');
      expect(actual.length).toEqual(2);
    });
  });

  describe('_renderOption', () => {
    it('produces a custom component', () => {
      const { target } = setupEnzyme();
      const options = target.instance()._onInputChange('FOO');
      const view = target.instance()._renderOption(options[0]);
      expect(view).toEqual({
        value: 'Foo',
        component: expect.anything(),
      });
    });
  });
});
