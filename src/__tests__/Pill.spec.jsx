import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { SLUG_SEPARATOR } from '../constants'
import { Pill, mapStateToProps } from '../Pill';

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
      <Pill fieldName="foo" trimmed="bar" />
    );

    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('uses the last element of a hierarchy filter slug', () => {
    const { props } = setupEnzyme()
    const actual = mapStateToProps({}, props)
    expect(actual.trimmed).toEqual('qaz')
  });

  it('allows the user to remove this filter', () => {
    const { target, props } = setupEnzyme()
    const button = target.find('button');

    button.simulate('click');
    expect(props.remove).toHaveBeenCalled();
  });
});
