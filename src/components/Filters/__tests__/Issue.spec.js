import React from 'react';
import { shallow } from 'enzyme';
import { Issue, mapStateToProps, mapDispatchToProps } from '../Issue';
import { slugify } from '../../../utils';

const fixture = [
  {
    'sub_issue.raw': {
      buckets: [
        { key: 'Information is not mine', doc_count: 7030 },
        { key: 'Account status', doc_count: 5103 },
      ],
    },
    key: 'Incorrect information on credit report',
    doc_count: 20991,
  },
  {
    'sub_issue.raw': {
      buckets: [
        { key: 'Debt is not mine', doc_count: 9990 },
        { key: 'Debt was paid', doc_count: 4632 },
      ],
    },
    key: "Cont'd attempts collect debt not owed",
    doc_count: 17244,
  },
  {
    'sub_issue.raw': {
      buckets: [],
    },
    key: 'Loan servicing, payments, escrow account',
    doc_count: 14605,
  },
  {
    'sub_issue.raw': {
      buckets: [],
    },
    key: 'Loan modification,collection,foreclosure',
    doc_count: 10716,
  },
  {
    'sub_issue.raw': {
      buckets: [],
    },
    key: 'Dealing with my lender or servicer',
    doc_count: 7783,
  },
  {
    'sub_issue.raw': {
      buckets: [],
    },
    key: 'Not here',
    doc_count: 999,
  },
];

/**
 *
 * @param options
 * @param filters
 */
function setupEnzyme(options, filters) {
  const props = {
    filters,
    options,
    forTypeahead: ['Foo', 'Bar', 'Baz'],
    typeaheadSelect: jest.fn(),
  };

  const target = shallow(<Issue {...props} />);

  return {
    props,
    target,
  };
}

describe('component:Issue', () => {
  describe('Typeahead interface', () => {
    describe('_onOptionSelected', () => {
      it('checks all the filters associated with the option', () => {
        const key = 'a';
        const { target, props } = setupEnzyme(fixture, [
          'a',
          'b',
          slugify('a', 'b'),
        ]);
        target.instance()._onOptionSelected({
          key,
        });

        expect(props.typeaheadSelect).toHaveBeenCalledWith(['a', 'b', 'a']);
      });
      describe('mapDispatchToProps', () => {
        it('hooks into replaceFilters', () => {
          const dispatch = jest.fn();
          mapDispatchToProps(dispatch).typeaheadSelect(['bar', 'baz']);
          expect(dispatch.mock.calls).toEqual([
            [
              {
                filterName: 'issue',
                requery: 'REQUERY_ALWAYS',
                type: 'FILTER_REPLACED',
                values: ['bar', 'baz'],
              },
            ],
          ]);
        });
      });
    });
  });
});

describe('sorting', () => {
  it('places selections ahead of unselected', () => {
    const selected = [
      'Incorrect information on credit report',
      slugify('Incorrect information on credit report', 'Account Status'),
      'Not here',
    ];
    const actual = mapStateToProps({
      query: { issue: selected },
      aggs: { issue: fixture },
    });
    expect(actual.options[1]).toEqual(fixture[5]);
  });

  it('treats child selections as parent selections', () => {
    const selected = [
      slugify("Cont'd attempts collect debt not owed", 'Debt was paid'),
    ];
    const actual = mapStateToProps({
      query: { issue: selected },
      aggs: { issue: fixture },
    });
    expect(actual.options[0]).toEqual(fixture[1]);
  });
});
