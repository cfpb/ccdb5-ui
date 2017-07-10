import React from 'react'
import { connect } from 'react-redux'
import { SLUG_SEPARATOR } from '../constants'
import AggregationBranch from './AggregationBranch'
import CollapsibleFilter from './CollapsibleFilter'
import Typeahead from '../Typeahead'

export const normalize = s => {
  return s.toLowerCase()
} 

export const sortSelThenCount = (options, selected) => {
  const retVal = (options || []).slice()

  // Sort the array so that selected items appear first, then by doc_count
  retVal.sort((a,b) => {
    const aSel = selected.indexOf(a.key) !== -1
    const bSel = selected.indexOf(b.key) !== -1

    if( aSel && !bSel ) {
      return -1;
    }
    if( !aSel && bSel ) {
      return 1;
    }

    // Both are selected or not selected
    // Sort by descending doc_count
    return b.doc_count - a.doc_count
  })
  
  return retVal
}

export class Issue extends React.Component {
  constructor(props) {
    super(props)
    this._onInputChange = this._onInputChange.bind(this)
    this._onOptionSelected = this._onOptionSelected.bind(this)
  }

  render() {
    const all = this.props.options
    const some = all.length > 5 ? all.slice(0, 5) : all
    const remain = all.length - 5

    return (
      <CollapsibleFilter title="Issue / sub-issue"
                         desc="The type of issue and sub-issue the consumer identified in the complaint"
                         showChildren={this.props.showChildren}
                         className="aggregation">
        <Typeahead placeholder="Enter name of issue"
                   onInputChange={this._onInputChange}
                   onOptionSelected={this._onOptionSelected}
                   renderOption={this._renderOption} />
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

  // --------------------------------------------------------------------------
  // Typeahead Helpers

  _onInputChange(value) {
    // Normalize the input value 
    const normalized = normalize(value)

    // Find the matches
    const filtered = this.props.forTypeahead
      .filter(x => x.normalized.indexOf(normalized) !== -1)
      .map(x => {
        return {
          key: x.key,
          position: x.normalized.indexOf(normalized),
          value
        }
      })

    // Sort the matches so that matches at the beginning of the string
    // appear first
    filtered.sort((a,b) => {
      return a.position - b.position
    })

    return filtered
  }

  _renderOption(obj) {
    const start = obj.key.substring(0, obj.position)
    const match = obj.key.substr(obj.position, obj.value.length)
    const end = obj.key.substring(obj.position + obj.value.length)

    return {
      value: obj.key,
      component: (
        <span>{start}<b>{match}</b>{end}</span>
      )
    }
  }

  _onOptionSelected(obj) {
    // TODO: Select the parent + children
    console.log('Selected "', obj.key, '"')
  }
}

export const mapStateToProps = state => {
  // See if there are an active issue filters
  const allIssues = state.query.issue || []
  const selections = []

  // Reduce the issues to the parent keys (and dedup)
  allIssues.forEach(x => {
    const idx = x.indexOf(SLUG_SEPARATOR)
    const key = (idx !== -1) ? x.substr(0, idx) : x
    if (selections.indexOf(key) === -1)  {
      selections.push(key)
    }
  })

  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount(state.aggs.issue, selections)

  // create an array optimized for typeahead
  const forTypeahead = options.map(x => {
    return {
      key: x.key,
      normalized: normalize(x.key)
    }
  })

  return {
    options,
    forTypeahead
  }
}

export default connect(mapStateToProps)(Issue)
