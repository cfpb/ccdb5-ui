import { connect } from 'react-redux'
import ListPanel from './ListPanel'
import MapPanel from './MapPanel'
import React from 'react'
import TrendsPanel from './TrendsPanel'

export class Results extends React.Component {
  render() {
    let currentPanel

    switch ( this.props.tab ) {
      case 'Trends':
        currentPanel = <TrendsPanel/>
        break;
      case 'List':
        currentPanel = <ListPanel/>
        break;
      case 'Map':
      default:
        currentPanel = <MapPanel/>
        break;
    }

    return (
      <div className="content_main">
        { currentPanel }
      </div>
    )
  }
}

const mapStateToProps = state => ( {
  tab: state.view.tab
} )

export default connect( mapStateToProps )( Results )
