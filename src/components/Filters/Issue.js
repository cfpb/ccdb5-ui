import { coalesce, sortSelThenCount } from '../../utils';
import AggregationBranch from './AggregationBranch';
import CollapsibleFilter from './CollapsibleFilter';
import { connect } from 'react-redux';
import MoreOrLess from './MoreOrLess';
import PropTypes from 'prop-types';
import React from 'react';
import { replaceFilters } from '../../actions/filter';
import { SLUG_SEPARATOR } from '../../constants';
import { HighlightingTypeahead } from '../Typeahead/HighlightingTypeahead';

export class Issue extends React.Component {
  constructor(props) {
    super(props);

    this._onOptionSelected = this._onOptionSelected.bind(this);
    this._onBucket = this._onBucket.bind(this);
  }

  render() {
    const desc =
      'The type of issue and sub-issue the consumer identified ' +
      'in the complaint';

    const listComponentProps = {
      fieldName: 'issue',
    };

    return (
      <CollapsibleFilter
        title="Issue / sub-issue"
        desc={desc}
        hasChildren={this.props.hasChildren}
        className="aggregation issue"
      >
        <HighlightingTypeahead
          ariaLabel="Start typing to begin listing issues"
          htmlId="issue-typeahead"
          placeholder="Enter name of issue"
          options={this.props.forTypeahead}
          onOptionSelected={this._onOptionSelected}
        />
        <MoreOrLess
          listComponent={AggregationBranch}
          listComponentProps={listComponentProps}
          options={this.props.options}
          perBucketProps={this._onBucket}
        />
      </CollapsibleFilter>
    );
  }

  // --------------------------------------------------------------------------
  // Typeahead Helpers

  _onOptionSelected(item) {
    const { filters } = this.props;
    const replacementFilters = filters
      // remove child items
      .filter((o) => o.indexOf(item.key + SLUG_SEPARATOR) === -1)
      // add parent item
      .concat(item.key);
    this.props.typeaheadSelect(replacementFilters);
  }

  // --------------------------------------------------------------------------
  // MoreOrLess Helpers

  _onBucket(bucket, props) {
    props.subitems = bucket['sub_issue.raw'].buckets;
    return props;
  }
}

export const mapStateToProps = (state) => {
  // See if there are an active issue filters
  const allIssues = coalesce(state.query, 'issue', []);
  const selections = [];

  // Reduce the issues to the parent keys (and dedup)
  allIssues.forEach((x) => {
    const idx = x.indexOf(SLUG_SEPARATOR);
    const key = idx === -1 ? x : x.substr(0, idx);
    if (selections.indexOf(key) === -1) {
      selections.push(key);
    }
  });

  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount(
    coalesce(state.aggs, 'issue', []),
    selections
  );

  // create an array optimized for typeahead
  const forTypeahead = options.map((x) => x.key);

  return {
    filters: allIssues,
    options,
    forTypeahead,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  typeaheadSelect: (values) => {
    dispatch(replaceFilters('issue', values));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Issue);

Issue.propTypes = {
  forTypeahead: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  hasChildren: PropTypes.bool,
  typeaheadSelect: PropTypes.func.isRequired,
};
