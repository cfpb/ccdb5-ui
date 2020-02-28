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
          {!abbr && <span>United States of America</span> }
          <span>{ name }</span>
          { abbr &&
            <a className="clear"
               onClick={ () => this.props.removeState( abbr ) }>
              { iconMap.getIcon( 'delete-round' ) }
              Clear
            </a>
          }
        </section>
        { name &&
        <section className="state-navigation">
          <a className="list"
             onClick={ () => this.props.showComplaints() }>
            View complaints for filtered states
          </a>
        </section>
        }
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
  showComplaints: () => {
    dispatch( showStateComplaints() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( MapToolbar )
