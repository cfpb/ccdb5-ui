// It uses this name rather than 'State' to distinguish from the React state
// Idea https://en.wikipedia.org/wiki/U.S._state

import React from 'react'
import { connect } from 'react-redux'
import AggregationItem from './AggregationItem'
import CollapsibleFilter from './CollapsibleFilter'
import Typeahead from '../Typeahead'
import { addMultipleFilters } from '../actions/filter'
import { THESE_UNITED_STATES } from '../constants'
import { normalize } from './utils'

const buildLabel = x => {
  return THESE_UNITED_STATES[x] + ' (' + x + ')'
}

export class FederalState extends React.Component {
  constructor(props) {
    super(props)
    this._onInputChange = this._onInputChange.bind(this)
    this._onOptionSelected = this._onOptionSelected.bind(this)
  }

  render() {
    return (
      <CollapsibleFilter title='State'
                         desc='The state of the mailing address provided by the consumer'
                         showChildren={this.props.showChildren}
                         className='aggregation'>
        <Typeahead placeholder='Enter state name or abbreviation'
                   onInputChange={this._onInputChange}
                   onOptionSelected={this._onOptionSelected}
                   renderOption={this._renderOption} />
        <ul>
        {
          this.props.options.map(bucket => 
            <AggregationItem item={bucket}
                             key={bucket.key}
                             fieldName="state"
            />
          )
        }
        </ul>
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
          label: x.label,
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
    const start = obj.label.substring(0, obj.position)
    const match = obj.label.substr(obj.position, obj.value.length)
    const end = obj.label.substring(obj.position + obj.value.length)

    return {
      value: obj.key,
      component: (
        <span>{start}<b>{match}</b>{end}</span>
      )
    }
  }

  _onOptionSelected(item) {
    this.props.typeaheadSelect(item.key)
  }
}

export const mapStateToProps = state => {
  // See if there are an active Federal State filters
  const selections = state.query.state || []
  const options = (state.aggs.state || [])
    .filter(x => selections.indexOf(x.key) !== -1)
    .map(x => {
      return {
        ...x,
        value: buildLabel(x.key)
      }
    })

  // create an array optimized for typeahead
  const forTypeahead = Object.keys(THESE_UNITED_STATES).map(x => {
    const label = buildLabel(x)

    return {
      key: x,
      label,
      normalized: normalize(label)
    }
  })

  return {
    options,
    forTypeahead
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    typeaheadSelect: (value) => {
      dispatch(addMultipleFilters('state', [value]))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FederalState)
