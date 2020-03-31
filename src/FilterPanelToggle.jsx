import './FilterPanelToggle.less'
import { connect } from 'react-redux'
import { filterVisiblityToggled } from './actions/view'
import React from 'react'

export class FilterPanelToggle extends React.Component {
  _setNormalization( val ) {
    this.props.onFilterToggle( val )
  }

  render() {
    return (
      <section className="filter-panel-toggle">
        <div className="m-btn-group">
          <p>&nbsp;</p>
          <button
            className={ 'a-btn' }
            onClick={ () => this._setNormalization( true ) }>Filter results
          </button>
        </div>
      </section>
    )
  }
}

export const mapStateToProps = state => ( {
  showButton: true
} );

export const mapDispatchToProps = dispatch => ( {
  onFilterToggle: () => {
    dispatch( filterVisiblityToggled() )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( FilterPanelToggle )
