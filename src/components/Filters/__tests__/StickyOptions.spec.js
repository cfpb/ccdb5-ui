import React from 'react';
import { shallow } from 'enzyme';
import StickyOptions from '../StickyOptions';

const fixture = [
  { key: 'DC', doc_count: 999 },
  { key: 'MS', doc_count: 99 },
  { key: 'WA', doc_count: 9 },
];

/**
 *
 * @param options
 * @param selections
 */
function setupEnzyme(options, selections) {
  const props = {
    fieldName: 'foo',
    onMissingItem: jest.fn((item) => {
      return StickyOptions.defaultProps.onMissingItem(item);
    }),
    options: options.slice(),
    selections: selections.slice(),
  };

  const target = shallow(<StickyOptions {...props} />);

  return {
    props,
    target,
  };
}

describe('component::StickyOptions', () => {
  describe('updating selections', () => {
    let target, props;
    beforeEach(() => {
      ({ target, props } = setupEnzyme(fixture, ['DC']));
    });

    it('adds new selections', () => {
      expect(target.state('tracked')).toEqual(['DC']);
    });

    it('adds new selections without removing previous selections', () => {
      target.setProps({ selections: ['MS', 'DC', 'WA'], options: [] });
      expect(target.state('tracked')).toEqual(['DC', 'MS', 'WA']);
    });

    it('handles unchanged selections', () => {
      target.setProps({ selections: ['DC'] });
      expect(target.state('tracked')).toEqual(['DC']);
    });

    it('asks for the missing option when a selection is not in the cache', () => {
      target.setProps({
        selections: ['NJ'],
        options: [{ key: 'VA', doc_count: 9 }],
      });
      expect(props.onMissingItem).toHaveBeenCalledWith('NJ');
    });
  });
});
