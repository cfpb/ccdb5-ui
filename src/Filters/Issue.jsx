import React from 'react'
import { connect } from 'react-redux'
import AggregationBranch from './AggregationBranch'
import CollapsibleFilter from './CollapsibleFilter'

export class Issue extends React.Component {
  render() {
    const all = this.props.options || []
    const some = all.length > 5 ? all.slice(0, 5) : all
    const remain = all.length - 5

    return (
      <CollapsibleFilter title="Issue / sub-issue"
                         desc="The type of issue and sub-issue the consumer identified in the complaint"
                         showChildren={this.props.showChildren}
                         className="aggregation">
        <ul>
          {some.map(bucket =>
            <AggregationBranch key={bucket.key}
                               item={bucket}
                               subitems={bucket['sub_issue.raw'].buckets}
                               fieldName="issue" />
          )}
        </ul>
          {remain > 0 ? (
            <div className="flex-fixed">
               <button className="a-btn a-btn__link hover more">
                 + Show {remain} more
               </button>
            </div>
          ) : null}
      </CollapsibleFilter>
    )
  }
}

export const mapStateToProps = state => {
  return {
    options: state.aggs.issue
  }
}

export default connect(mapStateToProps)(Issue)
