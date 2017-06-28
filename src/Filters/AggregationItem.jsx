import React, { PropTypes } from 'react';
import './Aggregation.less';
import { connect } from 'react-redux';
import { filterChanged } from '../actions/filter';

const AggregationItem = ({ item, fieldName, active, onClick }) => {
    return (
        <li className="flex-fixed layout-row" key={item.key}>
            <input type="checkbox" className="flex-fixed"
                   aria-label={item.key}
                   checked={active}
                   onClick={onClick}
            />
            <span className="flex-all bucket-key">{item.key}</span>
            <span className="flex-fixed bucket-count">{item.doc_count}</span>
        </li>
    );
}

AggregationItem.propTypes = {
  // item: PropTypes.obj.isRequired,
  // onClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    active: typeof state.query[ownProps.fieldName] !== 'undefined' && state.query[ownProps.fieldName].indexOf(ownProps.item.key) > -1
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      console.log('ONCLICK : ', ownProps);
      dispatch(filterChanged(ownProps.fieldName, ownProps.item));
    },
  };
};

const AggregationItemFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(AggregationItem);

export default AggregationItemFilter;
