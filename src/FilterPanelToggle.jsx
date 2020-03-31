import './FilterPanelToggle.less'
import { connect } from 'react-redux'
import { filterVisiblityToggled } from './actions/view'
import React from 'react'

export class FilterPanelToggle extends React.Component {
  render() {
    return (
      <section className="filter-panel-toggle">
        <div className="m-btn-group">
          <p>&nbsp;</p>
          <button
            className={ 'a-btn' }
            title={ this.props.showFilters ? 'Close Filters' : 'Filter results' }
            onClick={ () => this.props.onFilterToggle() }>
            { this.props.showFilters ? 'Close Filters' : 'Filter results' }
          </button>
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => ( {
  showFilters: state.view.showFilters
} )

export const mapDispatchToProps = dispatch => ( {
  onFilterToggle: () => {
    dispatch( filterVisiblityToggled() )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( FilterPanelToggle )
