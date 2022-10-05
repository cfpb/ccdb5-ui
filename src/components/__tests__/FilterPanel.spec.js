import React from 'react';
import {
  FilterPanel,
  mapDispatchToProps,
  mapStateToProps,
} from '../Filters/FilterPanel';
import { shallow } from 'enzyme';

/**
 *
 */
function setupEnzyme() {
  const props = {
    onFilterToggle: jest.fn(),
    hasButton: true,
    hasFilterToggle: true,
    hasFilters: false,
  };

  const target = shallow(<FilterPanel {...props} />);

  return {
    props,
    target,
  };
}

describe('mapDispatchToProps', () => {
  it('hooks into onFilterToggle', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).onFilterToggle();
    expect(dispatch.mock.calls.length).toEqual(1);
  });

  it('allows the user to trigger Filter Panel', () => {
    const { target, props } = setupEnzyme();
    const button = target.find('.filter-button button');

    button.simulate('click');
    expect(props.onFilterToggle).toHaveBeenCalled();
  });
});

describe('mapStateToProps', () => {
  it('maps state and props', () => {
    const state = {
      view: {
        hasFilters: true,
        width: 1000,
      },
    };
    const actual = mapStateToProps(state);
    expect(actual).toEqual({
      hasButton: false,
      hasFilterToggle: false,
      hasFilters: true,
    });
  });
});
