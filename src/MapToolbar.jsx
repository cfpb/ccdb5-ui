import './MapToolbar.less'
import { removeStateFilter, showStateComplaints } from './actions/map'
import { connect } from 'react-redux'
import iconMap from './iconMap'
import React from 'react'

export class MapToolbar extends React.Component {
  render() {
    const { abbr, name } = this.props.selectedState
    return (
      <div className="map-toolbar">
        <section className="state-heading">
          <span>{ name }</span>
          <a className="clear"
                  onClick={ () => this.props.removeState( abbr ) }>
              { iconMap.getIcon( 'delete-round' ) }
              Clear
          </a>
        </section>
        <section className="state-navigation">
          <a className="list"
                  onClick={ () => this.props.showComplaints( abbr ) }>
            View complaints from { name }
          </a>
        </section>
      </div>
    )
  }
}

export const mapStateToProps = state => ( {
  selectedState: state.map.selectedState
} )

export const mapDispatchToProps = dispatch => ( {
  removeState: stateAbbr => {
    dispatch( removeStateFilter( stateAbbr ) )
  },
  showComplaints: stateAbbr => {
    dispatch( showStateComplaints( stateAbbr ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( MapToolbar )
