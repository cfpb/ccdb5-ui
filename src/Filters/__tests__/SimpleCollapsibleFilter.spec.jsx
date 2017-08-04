import React from 'react';
import { mount } from 'enzyme';
import SimpleCollapsibleFilter from '../SimpleCollapsibleFilter';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <SimpleCollapsibleFilter title="foo" desc="bar" />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('component:SimpleCollapsibleFilter', () => {
  it('hides the children when Hide is clicked', () => {
    const target = mount(<SimpleCollapsibleFilter showChildren={true} />);
    const theButton = target.find('.toggle button')

    expect(target.state('showChildren')).toEqual(true);
    theButton.simulate('click');
    expect(target.state('showChildren')).toEqual(false);
  })    
})
