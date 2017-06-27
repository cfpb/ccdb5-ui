import React from 'react';
import CollapsibleFilter from './CollapsibleFilter';
import AggregationItem from './AggregationItem';
import './Aggregation.less';

export default class Aggregation extends React.Component {
  render() {
    return (
        <CollapsibleFilter title={this.props.title}
                           desc={this.props.desc}
                           className="aggregation">
            <ul>
            {this.props.options.map(bucket =>
                <AggregationItem item={bucket} key={ bucket.key } fieldName={ this.props.fieldName } />
            )}
            </ul>
            <div className="flex-fixed">
                <button className="a-btn a-btn__link hover more">+ Show X more</button>
            </div>
        </CollapsibleFilter>
    );
  }
}
