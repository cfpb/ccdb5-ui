import React from 'react';
import { mount } from 'enzyme';
import CollapsibleFilter from '../CollapsibleFilter';

describe('component:CollapsibleFilter', () => {
  it('hides the children when Hide is clicked', () => {
    const target = mount(<CollapsibleFilter hasChildren={true} />);
    const theButton = target.find('button.o-expandable_cue');

    expect(target.state('hasChildren')).toEqual(true);
    theButton.simulate('click');
    expect(target.state('hasChildren')).toEqual(false);
  });

  describe('componentDidUpdate', () => {
    it('triggers a new state update when props change', () => {
      const props = {
        hasChildren: false,
      };

      const target = mount(<CollapsibleFilter {...props} />);
      target.setProps({ hasChildren: true });
      const sv = target.state('hasChildren');
      expect(sv).toEqual(true);
    });
  });
});
