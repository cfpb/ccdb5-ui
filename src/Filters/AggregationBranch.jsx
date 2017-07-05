import React from 'react'
import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux';
import { SLUG_SEPARATOR } from '../constants'
import AggregationItem from './AggregationItem'
import { checkParentFilter, removeFilter } from '../actions/filter';
import './AggregationBranch.less'

export class AggregationBranch extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showChildren: this.props.showChildren || false }
    this._decideClickAction = this._decideClickAction.bind(this)
    this._toggleChildDisplay = this._toggleChildDisplay.bind(this)
  }

  _decideClickAction() {
    const {item, subitems, fieldName, active} = this.props

    if (active) {
      this.props.onlyRemoveParent(fieldName, item.key)
    }
    else {
      const childValues = subitems.map(sub => {
        return item.key + SLUG_SEPARATOR + sub.key
      })
      this.props.selectBranch(fieldName, item.key, childValues)
    }
  }

  _toggleChildDisplay() {
    this.setState({
      showChildren: !this.state.showChildren
    })
  }

  render() {
    const {item, subitems, fieldName, active} = this.props

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
        <li className="flex-fixed layout-row parent">
          <input type="checkbox" className="flex-fixed"
                 aria-label={item.key}
                 checked={active}
                 onClick={this._decideClickAction}
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

export const mapDispatchToProps = dispatch => {
  return {
    onlyRemoveParent: (fieldName, fieldValue) => {
      dispatch(removeFilter(fieldName, fieldValue))
    },
    selectBranch: (fieldName, parentValue, childrenValues) => {
      dispatch(checkParentFilter(fieldName, parentValue, childrenValues))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AggregationBranch)
