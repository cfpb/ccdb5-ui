import React, { PropTypes } from 'react';
import './Aggregation.less';

const AggregationItem = ({ item, onClick }) => {
    return (
        <li className="flex-fixed layout-row" key={item.key}>
            <input type="checkbox" className="flex-fixed"
                   aria-label={item.key}
                   checked={item.active} />
            <span className="flex-all bucket-key">{item.key}</span>
            <span className="flex-fixed bucket-count">{item.doc_count}</span>
        </li>
    );
}

AggregationItem.propTypes = {
  item: PropTypes.obj.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AggregationItem;
