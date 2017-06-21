import React from 'react';
import { FilterPanel } from '../FilterPanel';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  const aggs = {
    timely_response: [],
    company_response: []
  };

  it('renders without crashing', () => {
    const target = renderer.create(
      <FilterPanel aggs={ aggs } />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

