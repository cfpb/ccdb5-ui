import React from 'react';
import CollapsibleFilter from './CollapsibleFilter';
import AggregationItem from './AggregationItem';
import './Aggregation.less';

export default class Aggregation extends React.Component {
  render() {
    const all = this.props.options || [];
    const some = all.length > 6 ? all.slice(0, 5) : all
    const remain = all.length - 6

    return (
        <CollapsibleFilter title={this.props.title}
                           desc={this.props.desc}
                           showChildren={this.props.showChildren}
                           className="aggregation">
            <ul>
            {some.map(bucket =>
                <AggregationItem item={bucket} key={ bucket.key } fieldName={ this.props.fieldName } />
            )}
            </ul>
            {remain > 0 ? (
              <div className="flex-fixed">
                   <button className="a-btn a-btn__link hover more">+ Show {remain} more</button>
              </div>
            ) : null}
        </CollapsibleFilter>                 
    );
  }
}

