import { MODE_LIST, MODE_MAP } from './constants'
import { connect } from 'react-redux'
import ListPanel from './ListPanel'
import MapPanel from './MapPanel'
import React from 'react'

export class ResultsPanel extends React.Component {
  _getTabClass() {
    const classes = [ 'content_main', this.props.tab.toLowerCase() ]
    return classes.join( ' ' )
  }

  render() {
    let currentPanel

    switch ( this.props.tab ) {
      case MODE_LIST:
        currentPanel = <ListPanel/>
        break;
      case MODE_MAP:
      default:
        currentPanel = <MapPanel/>
        break;
    }

    return (
      <div className={ this._getTabClass() }>
        { currentPanel }
      </div>
    )
  }
}

const mapStateToProps = state => ( {
  tab: state.query.tab
} )

export default connect( mapStateToProps )( ResultsPanel )
