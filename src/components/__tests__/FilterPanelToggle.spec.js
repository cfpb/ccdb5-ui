import React from 'react';
import {
  FilterPanelToggle,
  mapDispatchToProps,
  mapStateToProps,
} from '../Filters/FilterPanelToggle';
import { shallow } from 'enzyme';

/**
 *
 */
function setupEnzyme() {
  const props = {
    aggs: {},
    onFilterToggle: jest.fn(),
    hasButton: true,
    hasFilterToggle: true,
    hasFilters: false,
  };

  const target = shallow(<FilterPanelToggle {...props} />);

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
    const button = target.find('button');

    button.simulate('click');
    expect(props.onFilterToggle).toHaveBeenCalled();
  });
});

describe('mapStateToProps', () => {
  it('maps state and props', () => {
    const state = {
      view: {
        hasFilters: true,
      },
    };
    const actual = mapStateToProps(state);
    expect(actual).toEqual({
      hasFilters: true,
    });
  });
});
