import { slugify, sortSelThenCount } from './utils'
import { addMultipleFilters } from '../actions/filter'
import AggregationBranch from './AggregationBranch'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import MoreOrLess from './MoreOrLess'
import React from 'react'
import { SLUG_SEPARATOR } from '../constants'
import Typeahead from '../Typeahead/HighlightingTypeahead'

export class Issue extends React.Component {
  constructor( props ) {
    super( props )

    this._onOptionSelected = this._onOptionSelected.bind( this )
    this._onBucket = this._onBucket.bind( this )
  }

  render() {
    const listComponentProps = {
      fieldName: 'issue'
    }

    return (
      <CollapsibleFilter title="Issue / sub-issue"
                         desc="The type of issue and sub-issue the consumer identified in the complaint"
                         showChildren={this.props.showChildren}
                         className="aggregation">
        <Typeahead placeholder="Enter name of issue"
                   options={this.props.forTypeahead}
                   onOptionSelected={this._onOptionSelected}
        />
        <MoreOrLess listComponent={AggregationBranch}
                    listComponentProps={listComponentProps}
                    options={this.props.options}
                    perBucketProps={this._onBucket} />
      </CollapsibleFilter>
    )
  }

  // --------------------------------------------------------------------------
  // Typeahead Helpers

  _onOptionSelected( item ) {
    // Find this option in the list
    let idx = -1
    for ( let i = 0; i < this.props.options.length && idx === -1; i++ ) {
      if ( this.props.options[i].key === item.key ) {
        idx = i
      }
    }
    console.assert( idx !== -1 )

    // Build a list of all the keys
    const values = [ item.key ]
    this.props.options[idx]['sub_issue.raw'].buckets.forEach( sub => {
      values.push( slugify( item.key, sub.key ) )
    } )

    this.props.typeaheadSelect( values )
  }

  // --------------------------------------------------------------------------
  // MoreOrLess Helpers

  _onBucket( bucket, props ) {
    props.subitems = bucket['sub_issue.raw'].buckets
    return props
  }
}

export const mapStateToProps = state => {
  // See if there are an active issue filters
  const allIssues = state.query.issue || []
  const selections = []

  // Reduce the issues to the parent keys (and dedup)
  allIssues.forEach( x => {
    const idx = x.indexOf( SLUG_SEPARATOR )
    const key = idx === -1 ? x : x.substr( 0, idx )
    if ( selections.indexOf( key ) === -1 ) {
      selections.push( key )
    }
  } )

  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount( state.aggs.issue, selections )

  // create an array optimized for typeahead
  const forTypeahead = options.map( x => x.key )

  return {
    options,
    forTypeahead
  }
}

export const mapDispatchToProps = dispatch => ( {
  typeaheadSelect: values => {
    dispatch( addMultipleFilters( 'issue', values ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( Issue )
