import './MapToolbar.less'
import { removeStateFilter, showStateComplaints } from './actions/map'
import { connect } from 'react-redux'
import React from 'react'

export class MapToolbar extends React.Component {
  _removeStateFilter( tab ) {
    this.props.removeFilter( tab )
  }
  _showComplaints( tab ) {
    this.props.showComplaints( tab )
  }

  render() {
    const { abbr, fullName } = this.props.selectedState
    return (
      <div className="mapToolbar">
        { fullName }
        <button className="map"
                onClick={ () => this._removeStateFilter( abbr ) }>
          Clear
        </button>
        <section>
          <button className="map"
                  onClick={ () => this._showComplaints( abbr ) }>
            View complaints from { fullName }
          </button>
        </section>
      </div>
    )
  }
}

export const mapStateToProps = state => ( {
  selectedState: state.map.selectedState
} )

export const mapDispatchToProps = dispatch => ( {
  removeFilter: stateAbbr => {
    dispatch( removeStateFilter( stateAbbr ) )
  },
  showComplaints: tab => {
    dispatch( showStateComplaints( tab ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( MapToolbar )
