import React from 'react';
import { mount } from 'enzyme';
import CollapsibleFilter from '../CollapsibleFilter';
import renderer from 'react-test-renderer';

describe('component:CollapsibleFilter', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = renderer.create(
        <CollapsibleFilter title="foo" desc="bar" />,
      );

      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  xit('hides the children when Hide is clicked', () => {
    const target = mount(<CollapsibleFilter hasChildren={true} />);
    const theButton = target.find('button.o-expandable_target');

    expect(target.state('hasChildren')).toEqual(true);
    theButton.simulate('click');
    expect(target.state('hasChildren')).toEqual(false);
  });

  describe('componentDidUpdate', () => {
    xit('triggers a new state update when props change', () => {
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
