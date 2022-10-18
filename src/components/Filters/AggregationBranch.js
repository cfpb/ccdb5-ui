import './AggregationBranch.less';
import {
  bindAll,
  coalesce,
  getAllFilters,
  sanitizeHtmlId,
  slugify,
} from '../../utils';
import { removeMultipleFilters, replaceFilters } from '../../actions/filter';
import AggregationItem from './AggregationItem';
import { connect } from 'react-redux';
import { FormattedNumber } from 'react-intl';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';
import { SLUG_SEPARATOR } from '../../constants';

export const UNCHECKED = 'UNCHECKED';
export const INDETERMINATE = 'INDETERMINATE';
export const CHECKED = 'CHECKED';

// ----------------------------------------------------------------------------
// Class

export class AggregationBranch extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hasChildren: props.hasChildren };

    bindAll(this, ['_decideClickAction', '_toggleChildDisplay']);
  }

  _decideClickAction() {
    const { activeChildren, item, subitems, filters, fieldName, checkedState } =
      this.props;

    const values = getAllFilters(item.key, subitems);
    // Add the active filters (that might be hidden)
    activeChildren.forEach((child) => values.add(child));

    if (checkedState === CHECKED) {
      this.props.uncheckParent(fieldName, [...values]);
    } else {
      this.props.checkParent({ fieldName, filters, item });
    }
  }

  _toggleChildDisplay() {
    this.setState({
      hasChildren: !this.state.hasChildren,
    });
  }

  render() {
    const { item, subitems, fieldName, checkedState } = this.props;

    // Fix up the subitems to prepend the current item key
    const buckets = subitems.map((sub) => ({
      disabled: item.isDisabled,
      key: slugify(item.key, sub.key),
      value: sub.key,
      // eslint-disable-next-line camelcase
      doc_count: sub.doc_count,
    }));

    // Special returns
    if (buckets.length === 0) {
      return (
        <AggregationItem item={item} key={item.key} fieldName={fieldName} />
      );
    }

    const liStyle = 'parent m-form-field m-form-field__checkbox body-copy';
    const id = sanitizeHtmlId(fieldName + '-' + item.key);

    let chevronIcon;
    if (this.state.hasChildren) {
      chevronIcon = iconMap.getIcon('up');
    } else {
      chevronIcon = iconMap.getIcon('down');
    }

    return (
      <div className={'aggregation-branch ' + sanitizeHtmlId(item.key)}>
        <li className={liStyle}>
          <input
            type="checkbox"
            aria-label={item.key}
            disabled={item.isDisabled}
            checked={checkedState === CHECKED}
            className="flex-fixed a-checkbox"
            id={id}
            onChange={this._decideClickAction}
          />
          <label className={this._labelStyle} htmlFor={id}>
            <span className="u-visually-hidden">{item.key}</span>
          </label>
          <button
            className="flex-all a-btn a-btn__link"
            onClick={this._toggleChildDisplay}
          >
            <span>{item.key}</span>
            {chevronIcon}
          </button>
          <span className="flex-fixed parent-count">
            <FormattedNumber value={item.doc_count} />
          </span>
        </li>
        {this.state.hasChildren === false ? null : (
          <ul className="children">
            {buckets.map((bucket) => (
              <AggregationItem
                item={bucket}
                key={bucket.key}
                fieldName={fieldName}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Properties

  get _labelStyle() {
    let s = 'toggle a-label';
    if (this.props.checkedState === INDETERMINATE) {
      s += ' indeterminate';
    }

    return s;
  }
}

export const mapStateToProps = (state, ownProps) => {
  // Find all query filters that refer to the field name
  const candidates = coalesce(state.query, ownProps.fieldName, []);

  // Do any of these values start with the key?
  const hasKey = candidates.filter((x) => x.indexOf(ownProps.item.key) === 0);

  // Does the key contain the separator?
  const activeChildren = hasKey.filter((x) => x.indexOf(SLUG_SEPARATOR) !== -1);
  const activeParent = hasKey.filter((x) => x === ownProps.item.key);

  let checkedState = UNCHECKED;
  if (activeParent.length === 0 && activeChildren.length > 0) {
    checkedState = INDETERMINATE;
  } else if (activeParent.length > 0) {
    checkedState = CHECKED;
  }

  return {
    activeChildren,
    checkedState,
    filters: candidates,
    focus: state.query.focus,
    hasChildren: activeChildren.length > 0,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  uncheckParent: (fieldName, values) => {
    dispatch(removeMultipleFilters(fieldName, values));
  },
  checkParent: (props) => {
    const { fieldName, filters, item } = props;
    // remove all of the child filters
    const replacementFilters = filters.filter(
      (o) => o.indexOf(item.key + SLUG_SEPARATOR) === -1
    );
    // add self/ parent filter
    replacementFilters.push(item.key);
    dispatch(replaceFilters(fieldName, replacementFilters));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AggregationBranch);

AggregationBranch.propTypes = {
  activeChildren: PropTypes.array,
  checkParent: PropTypes.func.isRequired,
  checkedState: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape({
    // eslint-disable-next-line camelcase
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
  }).isRequired,
  hasChildren: PropTypes.bool,
  subitems: PropTypes.array.isRequired,
  uncheckParent: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
};

AggregationBranch.defaultProps = {
  checkedState: UNCHECKED,
  hasChildren: false,
};
