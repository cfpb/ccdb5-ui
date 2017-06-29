import React from 'react';
import { Pill } from '../Pill';
import renderer from 'react-test-renderer';

describe('component:Pill', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <Pill fieldName="foo" value="bar" />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
