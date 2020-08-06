import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { SLUG_SEPARATOR } from '../../constants'
import { Pill, mapDispatchToProps } from '../Search/Pill';

function setupEnzyme() {
  const props = {
    fieldName: 'foo',
    value: ['bar', 'baz', 'qaz'].join(SLUG_SEPARATOR),
    trimmed: 'bar',
    remove: jest.fn()
  }

  const target = shallow(<Pill {...props} />);

  return {
    props,
    target
  }
}

describe('component:Pill', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <Pill fieldName="somefield"
            value={ "foo" + SLUG_SEPARATOR + 'bar' }
      />
    );

    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('allows the user to remove this filter', () => {
    const { target, props } = setupEnzyme()
    const button = target.find('button');

    button.simulate('click');
    expect(props.remove).toHaveBeenCalled();
  });
  
  describe('mapDispatchToProps', () => {
    it('hooks into removeFilter', () => {
      const { props } = setupEnzyme()
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch, props).remove();
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })
});
