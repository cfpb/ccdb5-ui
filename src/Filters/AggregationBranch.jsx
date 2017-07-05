import React from 'react'
import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux';
import { SLUG_SEPARATOR } from '../constants'
import AggregationItem from './AggregationItem'
import './AggregationBranch.less'

export class AggregationBranch extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showChildren: this.props.showChildren || false }
    this._toggleChildDisplay = this._toggleChildDisplay.bind(this)
  }

  _toggleChildDisplay() {
    this.setState({
      showChildren: !this.state.showChildren
    })
  }

  render() {
    const {item, subitems, fieldName, active, onClick} = this.props

    // Fix up the subitems to prepend the current item key
    const buckets = subitems.map(sub => {
      return {
        key: item.key + SLUG_SEPARATOR + sub.key,
        value: sub.key,
        doc_count: sub.doc_count
      }
    })

    // Special returns
    if (buckets.length === 0) {
      return <AggregationItem item={item} key={item.key} fieldName={fieldName} />
    }

    return (
      <div className="aggregation-branch">
        <li className="flex-fixed layout-row parent" key={item.key}>
          <input type="checkbox" className="flex-fixed"
                 aria-label={item.key}
                 checked={active}
                 onClick={onClick}
          />
          <div className="flex-all toggle">
            <button className="a-btn a-btn__link hover"
                    onClick={this._toggleChildDisplay}>
              <span>{item.key}</span>
              <span className={
                "cf-icon " + (this.state.showChildren ? 'cf-icon-up' : 'cf-icon-down')
              }></span>
            </button>            
          </div>
          <span className="flex-fixed parent-count">
            <FormattedNumber value={item.doc_count} />
          </span>
        </li>
        { !this.state.showChildren ? null :
          <ul className="children">{
            buckets.map(bucket =>
              <AggregationItem item={bucket} key={bucket.key} fieldName={fieldName} />
            )
          }</ul>
        }
      </div>
    )
  }
}

export const mapStateToProps = (state, ownProps) => {
  // Find all query filters that refer to the field name
  const candidates = state.query[ownProps.fieldName] || []

  // Do any of these values contain the key?
  const hasKey = candidates.filter(x => x.indexOf(ownProps.item.key) !== -1)

  // Does the key contain the separator?
  const activeChildren = hasKey.filter(x => x.indexOf(SLUG_SEPARATOR) !== -1)
  const activeParent = hasKey.filter(x => x.indexOf(SLUG_SEPARATOR) === -1)

  return {
    active: activeParent.length > 0,
    showChildren: activeChildren.length > 0
  }
}

export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AggregationBranch)

// TODO: Get active flag from state
// TODO: OnClick logic
// TODO: FILTER_PARENT_CHECKED action
