import { coalesce, sanitizeHtmlId } from '../../utils';
import { filterPatch, SLUG_SEPARATOR } from '../../constants';
import { replaceFilters, toggleFilter } from '../../actions/filter';
import { arrayEquals } from '../../utils/compare';
import { connect } from 'react-redux';
import { FormattedNumber } from 'react-intl';
import { getUpdatedFilters } from '../../utils/filters';
import PropTypes from 'prop-types';
import React from 'react';

export class AggregationItem extends React.Component {
  _onChange() {
    if (this.props.isActive) {
      this.props.removeFilter(this.props);
    } else {
      this.props.addFilter(this.props);
    }
  }

  render() {
    const { isActive, item, fieldName } = this.props;
    const value = item.value || item.key;
    const liStyle = 'layout-row m-form-field m-form-field__checkbox';
    const id = sanitizeHtmlId(fieldName + '-' + item.key);
    return (
      <li className={liStyle}>
        <input
          type="checkbox"
          className="flex-fixed a-checkbox"
          aria-label={item.key}
          disabled={item.isDisabled}
          checked={isActive}
          id={id}
          onChange={() => this._onChange()}
        />
        <label className="a-label flex-all bucket-key body-copy" htmlFor={id}>
          {value}
        </label>
        <span className="flex-fixed bucket-count">
          <FormattedNumber value={item.doc_count} />
        </span>
      </li>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const aggs = coalesce(state.aggs, ownProps.fieldName, []);
  const filters = coalesce(state.query, ownProps.fieldName, []);
  const value = ownProps.item.key;
  const parentKey = value.split(SLUG_SEPARATOR)[0];
  const isActive = filters.includes(value) || filters.includes(parentKey);
  return {
    isActive,
    aggs,
    filters,
  };
};

// remove parent and apply current filter
export const mapDispatchToProps = (dispatch, ownProps) => ({
  addFilter: (props) => {
    const { aggs, filters } = props;
    const { fieldName, item } = ownProps;
    const value = item.key;
    const isChildItem = value.indexOf(SLUG_SEPARATOR) > -1;
    // cases where its issue / product
    if (isChildItem && filterPatch.includes(fieldName)) {
      // We should find the parent
      // determine if the other siblings are already checked
      // check the parent only, and uncheck the rest so that the fake check
      // will take affect
      const parentFilter = value.split(SLUG_SEPARATOR)[0];
      const childFilter = value.split(SLUG_SEPARATOR)[1];
      /* eslint-disable no-unexpected-multiline */
      // TODO: reformat to not need the unexpected multiline.
      const subItems = aggs
        .find((o) => o.key === parentFilter)
        ['sub_' + fieldName + '.raw'].buckets.map((o) => o.key)
        .sort();
      /* eslint-enable no-unexpected-multiline */

      const parentKey = parentFilter + SLUG_SEPARATOR;
      const selectedFilters = filters
        .filter((o) => o.indexOf(parentKey) > -1)
        .map((o) => o.replace(parentKey, ''));
      selectedFilters.push(childFilter);

      selectedFilters.sort();

      let appliedFilters;
      if (arrayEquals(selectedFilters, subItems)) {
        // remove subitems, add parent filter
        appliedFilters = filters
          .filter((o) => o.indexOf(parentKey) === -1)
          .concat(parentFilter);
      } else {
        // just add the single filter and apply filters
        appliedFilters = filters.concat(value);
      }
      dispatch(replaceFilters(fieldName, appliedFilters));
    } else {
      dispatch(toggleFilter(fieldName, item));
    }
  },
  removeFilter: (props) => {
    const { aggs, filters } = props;
    const { fieldName, item } = ownProps;
    if (filterPatch.includes(fieldName)) {
      const filterName = item.key;
      const updatedFilters = getUpdatedFilters(
        filterName,
        filters,
        aggs,
        fieldName,
      );
      dispatch(replaceFilters(fieldName, updatedFilters));
    } else {
      dispatch(toggleFilter(fieldName, item));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AggregationItem);

AggregationItem.propTypes = {
  isActive: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape({
    // eslint-disable-next-line camelcase
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
  }).isRequired,
  removeFilter: PropTypes.func.isRequired,
  addFilter: PropTypes.func.isRequired,
};

AggregationItem.defaultProps = {
  isActive: false,
};
