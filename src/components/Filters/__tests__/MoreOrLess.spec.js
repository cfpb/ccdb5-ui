import AggregationItem from '../AggregationItem';
import MoreOrLess from '../MoreOrLess';
import React from 'react';
import { shallow } from 'enzyme';

const fixture = [
  { key: 'alpha', doc_count: 99 },
  { key: 'beta', doc_count: 99 },
  { key: 'gamma', doc_count: 99 },
  { key: 'delta', doc_count: 99 },
  { key: 'epsilon', doc_count: 99 },
  { key: 'zeta', doc_count: 99 },
  { key: 'eta', doc_count: 99 },
  { key: 'theta', doc_count: 99 },
];

/**
 *
 * @param initial
 */
function setupEnzyme(initial) {
  const props = {
    listComponent: AggregationItem,
    options: initial,
  };

  const target = shallow(<MoreOrLess {...props} />);
  return {
    props,
    target,
  };
}

describe('component:MoreOrLess', () => {
  it('expects showAll to start false and toggle all bool states', () => {
    const { target } = setupEnzyme(fixture);
    // Initial state should be false
    expect(target.state().hasMore).toEqual(false);
    target.instance()._toggleShowMore();
    expect(target.state().hasMore).toEqual(true);
    target.instance()._toggleShowMore();
    expect(target.state().hasMore).toEqual(false);
  });
});
