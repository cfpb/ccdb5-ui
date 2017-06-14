import React from 'react';
import CollapsibleFilter from './CollapsibleFilter';
import './Aggregation.less';

export default class Aggregation extends React.Component {
  render() {
    return (
        <CollapsibleFilter title={this.props.title} 
                           desc={this.props.desc}
                           className="aggregation">
            <ul>
            {this.props.options.map(bucket => 
                <li className="flex-fixed layout-row" key={bucket.key}>
                    <input type="checkbox" className="flex-fixed"
                           aria-label={bucket.key}
                           checked={bucket.active} />
                    <span className="flex-all bucket-key">{bucket.key}</span>
                    <span className="flex-fixed bucket-count">{bucket.doc_count}</span>
                </li>
            )}
            </ul>
            <div className="flex-fixed">
                <button className="a-btn a-btn__link hover more">+ Show X more</button>
            </div>
        </CollapsibleFilter>                 
    );
  }
}
