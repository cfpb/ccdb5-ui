// It uses this name rather than 'State' to distinguish from the React state
// Idea https://en.wikipedia.org/wiki/U.S._state

import { addMultipleFilters } from '../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import HighlightingOption from '../Typeahead/HighlightingOption'
import { normalize } from './utils'
import React from 'react'
import StickyOptions from './StickyOptions'
import { THESE_UNITED_STATES } from '../constants'
import Typeahead from '../Typeahead'

const buildLabel = x => THESE_UNITED_STATES[x] + ' (' + x + ')'

export class FederalState extends React.Component {
  constructor( props ) {
    super( props )
    this._onInputChange = this._onInputChange.bind( this )
    this._onOptionSelected = this._onOptionSelected.bind( this )
    this._onMissingItem = this._onMissingItem.bind( this )
  }

  render() {
    return (
      <CollapsibleFilter title="State"
                         desc="The state of the mailing address provided by the consumer"
                         showChildren={this.props.showChildren}
                         className="aggregation">
        <Typeahead placeholder="Enter state name or abbreviation"
                   onInputChange={this._onInputChange}
                   onOptionSelected={this._onOptionSelected}
                   renderOption={this._renderOption} />
        <StickyOptions fieldName="state"
                       onMissingItem={this._onMissingItem}
                       options={this.props.options}
                       selections={this.props.selections}
        />
      </CollapsibleFilter>
    )
  }

  // --------------------------------------------------------------------------
  // Typeahead Helpers

  _onInputChange( value ) {
    // Normalize the input value
    const normalized = normalize( value )
    const allUpper = normalized.toUpperCase()

    // Find the matches
    const filtered = this.props.forTypeahead
      .filter( x => x.normalized.indexOf( normalized ) !== -1 )
      .map( x => ( {
        key: x.key,
        label: x.label,
        position: x.normalized.indexOf( normalized ),
        value
      } ) )

    // Sort the matches so that:
    filtered.sort( ( a, b ) => {
      // 1.) A matching state abbreviation appears first (OR > North Carolina)
      const aMatched = a.key === allUpper
      const bMatched = b.key === allUpper

      if ( aMatched && !bMatched ) {
        return -1
      }
      if ( !aMatched && bMatched ) {
        return 1
      }

      // 2.) matches at the beginning of the string appear before later matches
      return a.position - b.position
    } )

    return filtered
  }

  _renderOption( obj ) {
    return {
      value: obj.key,
      component: <HighlightingOption {...obj} />
    }
  }

  _onOptionSelected( item ) {
    this.props.typeaheadSelect( item.key )
  }

  // --------------------------------------------------------------------------
  // StickyOption Helpers

  _onMissingItem( key ) {
    return {
      key,
      value: buildLabel( key ),
      doc_count: 0
    }
  }
}

export const mapStateToProps = state => {
  // See if there are an active Federal State filters
  const selections = state.query.state || []
  const options = ( state.aggs.state || [] )
    .map( x => ( {
      ...x,
      value: buildLabel( x.key )
    } ) )

  // create an array optimized for typeahead
  const forTypeahead = Object.keys( THESE_UNITED_STATES ).map( x => {
    const label = buildLabel( x )

    return {
      key: x,
      label,
      normalized: normalize( label )
    }
  } )

  return {
    forTypeahead,
    options,
    selections
  }
}

export const mapDispatchToProps = dispatch => ( {
  typeaheadSelect: value => {
    dispatch( addMultipleFilters( 'state', [ value ] ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( FederalState )
