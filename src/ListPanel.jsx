import './ListPanel.less'
import ActionBar from './ActionBar'
import ComplaintCard from './ComplaintCard'
import { connect } from 'react-redux'
import ErrorBlock from './Error'
import Loading from './Dialogs/Loading'
import Pagination from './Pagination'
import React from 'react'
import StaleDataWarnings from './StaleDataWarnings'

const ERROR = 'ERROR'
const NO_RESULTS = 'NO_RESULTS'
const RESULTS = 'RESULTS'

export class ListPanel extends React.Component {
  constructor( props ) {
    super( props )

    // Render/Phase Map
    this.renderMap = {
      ERROR: this._renderError.bind( this ),
      NO_RESULTS: this._renderNoResults.bind( this ),
      RESULTS: this._renderResults.bind( this )
    }
  }

  render() {
    const phase = this._determinePhase()

    return (
      <section className="list-panel">
        <ActionBar />
        <StaleDataWarnings />
        { this.renderMap[phase]() }
        <Pagination />
        <Loading isLoading={this.props.isLoading || false} />
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Phase Machine

  _determinePhase() {
    // determine the phase
    let phase = NO_RESULTS
    if ( this.props.error ) {
      phase = ERROR
    } else if ( this.props.items.length > 0 ) {
      phase = RESULTS
    }

    return phase
  }

  // --------------------------------------------------------------------------
  // Subrender Methods

  _renderError() {
    return (
       <ErrorBlock text="There was a problem executing your search" />
    )
  }

  _renderNoResults() {
    return (
       <h2>No results were found for your search</h2>
    )
  }

  _renderResults() {
    return (
      <ul className="cards-panel">
        { this.props.items.map(
          item => <ComplaintCard key={item.complaint_id} row={item} />
        )}
      </ul>
    )
  }
}

const mapStateToProps = state => ( {
  error: state.aggs.error,
  isLoading: state.results.isLoading,
  items: state.results.items
} )

export default connect( mapStateToProps )( ListPanel )
