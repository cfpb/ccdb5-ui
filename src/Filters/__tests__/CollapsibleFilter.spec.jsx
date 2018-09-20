import React from 'react';
import { mount } from 'enzyme';
import CollapsibleFilter from '../CollapsibleFilter';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <CollapsibleFilter title="foo" desc="bar" />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('component:CollapsibleFilter', () => {
  it('hides the children when Hide is clicked', () => {
    const target = mount(<CollapsibleFilter showChildren={true} />);
    const theButton = target.find('button.o-expandable_cue');

    expect(target.state('showChildren')).toEqual(true);
    theButton.simulate('click');
    expect(target.state('showChildren')).toEqual(false);
  })    
})
