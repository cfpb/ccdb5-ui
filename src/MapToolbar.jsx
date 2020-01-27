import './MapToolbar.less'
import { removeStateFilter, showStateComplaints } from './actions/map'
import { connect } from 'react-redux'
import React from 'react'

export class MapToolbar extends React.Component {
  render() {
    const { abbr, fullName } = this.props.selectedState
    return (
      <div className="mapToolbar">
        { fullName }
        <button className="clear"
                onClick={ () => this.props.removeState( abbr ) }>
          Clear
        </button>
        <section>
          <button className="list"
                  onClick={ () => this.props.showComplaints( abbr ) }>
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
  removeState: stateAbbr => {
    dispatch( removeStateFilter( stateAbbr ) )
  },
  showComplaints: tab => {
    dispatch( showStateComplaints( tab ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( MapToolbar )
