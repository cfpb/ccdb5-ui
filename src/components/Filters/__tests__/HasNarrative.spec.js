import { HasNarrative, mapDispatchToProps } from '../HasNarrative';
import { mount } from 'enzyme';
import React from 'react';

/**
 *
 * @param initialProps
 */
function setupEnzyme(initialProps = {}) {
  const props = Object.assign(
    {
      toggleFlag: jest.fn(),
      options: {
        isChecked: true,
        phase: '',
      },
    },
    initialProps
  );

  const target = mount(<HasNarrative {...props} />);

  return {
    props,
    target,
  };
}

describe('component::HasNarrative', () => {
  describe('flag filter changed', () => {
    it('triggers an update when checkbox is clicked', () => {
      const { target, props } = setupEnzyme();
      const input = target.find('#filterHasNarrative');
      input.simulate('change');
      expect(props.toggleFlag).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into toggleFlag', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).toggleFlag();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });
});
