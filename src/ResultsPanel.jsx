import './ResultsPanel.less'
import ActionBar from './ActionBar'
import ComplaintCard from './ComplaintCard'
import { connect } from 'react-redux'
import { MemoryRouter } from 'react-router'
import Pagination from './Pagination'
import React from 'react'

const ERROR = 'ERROR'
const NO_RESULTS = 'NO_RESULTS'
const RESULTS = 'RESULTS'

export class ResultsPanel extends React.Component {
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
    let composeClasses = 'results-panel'
    if ( this.props.className ) {
      composeClasses += ' ' + this.props.className
    }

    const phase = this._determinePhase()

    return (
      <MemoryRouter>
        <section className={composeClasses}>
          <ActionBar />
          { this.renderMap[phase]() }
          <Pagination />
        </section>
      </MemoryRouter>
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
       <h2>There was a problem executing your search</h2>
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
  error: state.results.error,
  items: state.results.items
} )

export default connect( mapStateToProps )( ResultsPanel )
