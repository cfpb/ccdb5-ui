import React, { PropTypes } from 'react';
import './Aggregation.less';
import { connect } from 'react-redux';
import { filterChanged, filterToggle } from '../actions/filter';

const AggregationItem = ({ item, fieldName, onClick }) => {
    return (
        <li className="flex-fixed layout-row" key={item.key}>
            <input type="checkbox" className="flex-fixed"
                   aria-label={item.key}
                   checked={item.active}
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
    active: false
    // active = state.query[ownProps.title].
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      console.log('ONCLICK : ', ownProps);
      dispatch(filterToggle(ownProps.fieldName, ownProps.item));
    },
  };
};

const AggregationItemFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(AggregationItem);

export default AggregationItemFilter;
