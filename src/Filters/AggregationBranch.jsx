import React from 'react'
import { FormattedNumber } from 'react-intl'
import { SLUG_SEPARATOR } from '../constants'
import AggregationItem from './AggregationItem';
import './AggregationBranch.less'

export class AggregationBranch extends React.Component {
  constructor(props) {
    super(props);
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

export default AggregationBranch

// TODO: ShowChildren is TRUE if one of the children is selected
// TODO: Get active flag from state
// TODO: OnClick logic
// TODO: FILTER_PARENT_CHECKED action
