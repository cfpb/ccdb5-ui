import { addMultipleFilters } from '../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import React from 'react'
import StickyOptions from './StickyOptions'
import Typeahead from '../Typeahead/HighlightingTypeahead'

const FIELD_NAME = 'company'

export class CompanyName extends React.Component {
  constructor( props ) {
    super( props )
    this._onOptionSelected = this._onOptionSelected.bind( this )
  }

  render() {
    return (
      <CollapsibleFilter title="Matched Company Name"
                         desc="The company name as it appears in our complaint system, which may be different than the name the consumer provided in their complaint"
                         className="aggregation">
        <Typeahead placeholder="Enter company name"
                   options={this.props.forTypeahead}
                   onOptionSelected={this._onOptionSelected}
        />
        <StickyOptions fieldName={FIELD_NAME}
                       options={this.props.options}
                       selections={this.props.selections}
        />
      </CollapsibleFilter>
    )
  }

  _onOptionSelected( item ) {
    this.props.typeaheadSelect( item.key )
  }
}

export const mapStateToProps = state => {
  const options = state.aggs[FIELD_NAME] || []
  const forTypeahead = options.map( x => x.key )

  return {
    forTypeahead,
    options,
    selections: state.query[FIELD_NAME] || []
  }
}

export const mapDispatchToProps = dispatch => ( {
  typeaheadSelect: value => {
    dispatch( addMultipleFilters( FIELD_NAME, [ value ] ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( CompanyName )
