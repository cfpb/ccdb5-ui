import './ListPanel.less'
import '../RefineBar/RefineBar.less'
import { changeSize, changeSort } from '../../actions/paging'
import { sizes, sorts } from '../../constants'
import ActionBar from '../ActionBar'
import ComplaintCard from './ComplaintCard'
import { connect } from 'react-redux'
import ErrorBlock from '../Warnings/Error'
import FilterPanel from '../Filters/FilterPanel'
import FilterPanelToggle from '../Filters/FilterPanelToggle'
import Loading from '../Dialogs/Loading'
import Pagination from './Pagination'
import React from 'react'
import { Select } from '../RefineBar/Select'
import { sendAnalyticsEvent } from '../../utils'
import { Separator } from '../RefineBar/Separator'

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
        { this.props.showMobileFilters && <FilterPanel/> }
        <div className="layout-row refine-bar">
          <FilterPanelToggle/>
          <Separator />
          <Select label={ 'Select the number of results to display at a time' }
                  title={ 'Show' }
                  values={ sizes }
                  id={ 'size' }
                  value={ this.props.size }
                  handleChange={ this.props.onSize }/>
          <Select label={ 'Choose the order in which the results are ' +
          'displayed' }
                  title={ 'Sort' }
                  values={ sorts }
                  id={ 'sort' }
                  value={ this.props.sort }
                  handleChange={ this.props.onSort }/>
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
    sendAnalyticsEvent( 'Dropdown', iSize + ' results' )
    dispatch( changeSize( iSize ) )
  },
  onSort: ev => {
    const { value } = ev.target
    sendAnalyticsEvent( 'Dropdown', sorts[value] )
    dispatch( changeSort( value ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ListPanel )
