import React from 'react';
import { PillPanel } from '../PillPanel';
import renderer from 'react-test-renderer';

describe('component:PillPanel', () => {
  it('renders without crashing', () => {
    const filters = {
      alpha: 'Apples',
      beta: 'Bananas are great',
    };

    const target = renderer.create(
      <PillPanel filters={filters} />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
