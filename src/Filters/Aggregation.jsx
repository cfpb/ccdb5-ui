import React from 'react';
import CollapsibleFilter from './CollapsibleFilter';
import './Aggregation.less';

export default class Aggregation extends React.Component {
  render() {
    const all = this.props.options || [];
    const some = all.length > 6 ? all.slice(0, 5) : all
    const remain = all.length - 6

    return (
        <CollapsibleFilter title={this.props.title} 
                           desc={this.props.desc}
                           className="aggregation">
            <ul>
            {some.map(bucket =>
                <li className="flex-fixed layout-row" key={bucket.key}>
                    <input type="checkbox" className="flex-fixed"
                           aria-label={bucket.key}
                           checked={bucket.active} />
                    <span className="flex-all bucket-key">{bucket.key}</span>
                    <span className="flex-fixed bucket-count">{bucket.doc_count}</span>
                </li>
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

