import './ListPanel.less'
import '../RefineBar/RefineBar.less'
import { changeSize, changeSort } from '../../actions/paging'
import ActionBar from '../ActionBar'
import ComplaintCard from './ComplaintCard'
import { connect } from 'react-redux'
import ErrorBlock from '../Warnings/Error'
import FilterPanel from '../Filters/FilterPanel'
import FilterPanelToggle from '../Filters/FilterPanelToggle'
import Loading from '../Dialogs/Loading'
import Pagination from './Pagination'
import React from 'react'
import { Separator } from '../RefineBar/Separator'
import StaleDataWarnings from '../Warnings/StaleDataWarnings'

const ERROR = 'ERROR'
const NO_RESULTS = 'NO_RESULTS'
const RESULTS = 'RESULTS'

const sizes = [ 10, 25, 50, 100 ]

/* eslint-disable camelcase */

const sorts = {
  created_date_desc: 'Newest to oldest',
  created_date_asc: 'Oldest to newest',
  relevance_desc: 'Relevance',
  relevance_asc: 'Relevance (asc)'
}

/* eslint-enable camelcase */

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
        { this.props.showMobileFilters && <FilterPanel/> }
        <div className="layout-row refine-bar">
          <FilterPanelToggle/>
          <Separator />
          <section className="cf-select">
            <label className="u-visually-hidden" htmlFor="choose-size">
              Select the number of results to display at a time
            </label>
            <p>
              Show
            </p>
            <select value={ this.props.size } id="choose-size"
                    onChange={ this.props.onSize }>
              { sizes.map(
                x => <option key={ x } value={ x }>{ x } results</option>
              ) }
            </select>
          </section>
          <section className="cf-select">
            <label className="u-visually-hidden" htmlFor="choose-sort">
              Choose the order in which the results are displayed
            </label>
            <p>
              Sort
            </p>
            <select value={ this.props.sort } id="choose-sort"
                    onChange={ this.props.onSort }>
              { Object.keys( sorts ).map( x =>
                <option key={ x } value={ x }>{ sorts[x] }</option>
              ) }
            </select>
          </section>
        </div>
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
  items: state.results.items,
  showMobileFilters: state.view.width < 750,
  size: state.query.size,
  sort: state.query.sort
} )

export const mapDispatchToProps = dispatch => ( {
  onSize: ev => {
    const iSize = parseInt( ev.target.value, 10 )
    dispatch( changeSize( iSize ) )
  },
  onSort: ev => {
    dispatch( changeSort( ev.target.value ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ListPanel )
