import React from 'react';
import { shallow } from 'enzyme';
import {
  AggregationBranch,
  CHECKED,
  mapDispatchToProps,
  UNCHECKED,
} from '../AggregationBranch';
import { slugify } from '../../../utils';

// ----------------------------------------------------------------------------
// Setup

const item = {
  key: 'foo',
  doc_count: 99,
};

const subitems = [
  { key: 'bar', doc_count: 90 },
  { key: 'baz', doc_count: 5 },
  { key: 'qaz', doc_count: 4 },
];

/**
 *
 * @param checkedState
 */
function setupEnzyme(checkedState = UNCHECKED) {
  const props = {
    activeChildren: [
      // not hidden
      slugify('foo', 'bar'),
      // hidden
      slugify('foo', 'quux'),
    ],
    checkedState,
    checkParent: jest.fn(),
    fieldName: 'issue',
    filters: [],
    item: item,
    subitems: subitems,
    uncheckParent: jest.fn(),
  };

  const target = shallow(<AggregationBranch {...props} />);

  return {
    props,
    target,
  };
}

// ----------------------------------------------------------------------------
// Test

describe('component::AggregationBranch', () => {
  describe('toggle behavior', () => {
    it('shows the children when the label is clicked', () => {
      const { target } = setupEnzyme();
      const theButton = target.find('button');

      expect(target.state('hasChildren')).toEqual(false);
      theButton.simulate('click');
      expect(target.state('hasChildren')).toEqual(true);
    });
  });

  describe('parent checkbox logic', () => {
    it('calls one action when the checkbox is already selected', () => {
      const { target, props } = setupEnzyme(CHECKED);
      const checkbox = target.find('li.parent input[type="checkbox"]');
      checkbox.simulate('change');
      expect(props.uncheckParent).toHaveBeenCalledWith('issue', [
        'foo',
        'foo•bar',
        'foo•baz',
        'foo•qaz',
        'foo•quux',
      ]);
      expect(props.checkParent).not.toHaveBeenCalled();
    });

    it('calls another action when the checkbox is not selected', () => {
      const { target, props } = setupEnzyme();
      const checkbox = target.find('li.parent input[type="checkbox"]');
      checkbox.simulate('change');
      expect(props.uncheckParent).not.toHaveBeenCalled();
      expect(props.checkParent).toHaveBeenCalledWith({
        fieldName: 'issue',
        filters: [],
        item: { doc_count: 99, key: 'foo' },
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into replaceFilters', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).checkParent({
        fieldName: 'foo',
        filters: [
          slugify('bay', 'bee'),
          slugify('bay', 'ah'),
          'another filter',
        ],
        item: { key: 'bay' },
        values: ['bar', 'baz'],
      });
      expect(dispatch.mock.calls).toEqual([
        [
          {
            filterName: 'foo',
            requery: 'REQUERY_ALWAYS',
            type: 'FILTER_REPLACED',
            values: ['another filter', 'bay'],
          },
        ],
      ]);
    });

    it('hooks into removeMultipleFilters', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).uncheckParent({
        fieldName: 'foo',
        values: ['bar', 'baz'],
      });
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });
});
