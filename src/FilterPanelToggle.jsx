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
            title="Filter results"
            onClick={ () => this.props.onFilterToggle() }>Filter results
          </button>
        </div>
      </section>
    )
  }
}

export const mapDispatchToProps = dispatch => ( {
  onFilterToggle: () => {
    dispatch( filterVisiblityToggled() )
  }
} );

export default connect( null, mapDispatchToProps )( FilterPanelToggle )
