import { connect } from 'react-redux'
import ListPanel from './ListPanel'
import MapPanel from './MapPanel'
import React from 'react'

export class ResultsPanel extends React.Component {
  render() {
    let currentPanel

    switch ( this.props.tab ) {
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
  tab: state.query.tab
} )

export default connect( mapStateToProps )( ResultsPanel )
