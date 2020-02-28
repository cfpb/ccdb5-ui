import './MapToolbar.less'
import { clearStateFilter, showStateComplaints } from './actions/map'
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
               onClick={ () => this.props.clearStates() }>
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
  clearStates: () => {
    dispatch( clearStateFilter() )
  },
  showComplaints: () => {
    dispatch( showStateComplaints() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( MapToolbar )
