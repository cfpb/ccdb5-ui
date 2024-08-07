import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sortSelThenCount } from '../../utils';
import CollapsibleFilter from './CollapsibleFilter';
import { filtersReplaced } from '../../reducers/filters/filtersSlice';
import { SLUG_SEPARATOR } from '../../constants';
import { Typeahead } from '../Typeahead/Typeahead/Typeahead';
import { selectAggsIssue } from '../../reducers/aggs/selectors';
import { selectFiltersIssue } from '../../reducers/filters/selectors';
import MoreOrLess from './MoreOrLess/MoreOrLess';
import AggregationBranch from './AggregationBranch';

export const Issue = ({ hasChildren }) => {
  const dispatch = useDispatch();
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const aggsFilters = useSelector(selectAggsIssue);
  const filters = useSelector(selectFiltersIssue);

  const desc =
    'The type of issue and sub-issue the consumer identified ' +
    'in the complaint';
  const listComponentProps = {
    fieldName: 'issue',
  };

  const selections = [];
  // Reduce the issues to the parent keys (and dedup)
  filters.forEach((filter) => {
    const idx = filter.indexOf(SLUG_SEPARATOR);
    const key = idx === -1 ? filter : filter.substring(0, idx);
    if (selections.indexOf(key) === -1) {
      selections.push(key);
    }
  });
  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount(aggsFilters, selections);
  // create an array optimized for typeahead
  const optionKeys = options.map((opt) => opt.key);

  const onInputChange = (value) => {
    const num = value.toLowerCase();
    if (num === '') {
      setDropdownOptions([]);
      return;
    }
    const options = optionKeys.map((opt) => ({
      key: opt,
      label: opt,
      position: opt.toLowerCase().indexOf(num),
      value,
    }));
    setDropdownOptions(options);
  };

  const onSelection = (items) => {
    const replacementFilters = filters
      // remove child items
      .filter((filter) => filter.indexOf(items[0].key + SLUG_SEPARATOR) === -1)
      // add parent item
      .concat(items[0].key);
    dispatch(filtersReplaced('issue', replacementFilters));
  };

  const onBucket = (bucket, props) => {
    props.subitems = bucket['sub_issue.raw'].buckets;
    return props;
  };

  return (
    <CollapsibleFilter
      title="Issue / sub-issue"
      desc={desc}
      hasChildren={hasChildren}
      className="aggregation issue"
    >
      <Typeahead
        ariaLabel="Start typing to begin listing issues"
        htmlId="issue-typeahead"
        placeholder="Enter name of issue"
        handleChange={onSelection}
        handleInputChange={onInputChange}
        hasClearButton={true}
        options={dropdownOptions}
      />
      <MoreOrLess
        listComponent={AggregationBranch}
        listComponentProps={listComponentProps}
        options={options}
        perBucketProps={onBucket}
      />
    </CollapsibleFilter>
  );
};

Issue.propTypes = {
  hasChildren: PropTypes.bool,
};
