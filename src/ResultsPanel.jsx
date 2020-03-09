import { MODE_LIST, MODE_MAP } from './constants'
import { connect } from 'react-redux'
import ListPanel from './ListPanel'
import MapPanel from './MapPanel'
import PrintInfo from './PrintInfo'
import PrintInfoFooter from './PrintInfoFooter'
import { printModeChanged } from './actions/view'
import React from 'react'

export class ResultsPanel extends React.Component {
  constructor( props ) {
    super( props )
    // Bindings
    this._updatePrintStyle = this._togglePrintStyles.bind( this );
  }

  componentDidMount() {
    window.addEventListener( 'afterprint', this._updatePrintStyle );
    window.addEventListener( 'beforeprint', this._updatePrintStyle );
  }

  componentWillUnmount() {
    window.removeEventListener( 'afterprint', this._updatePrintStyle );
    window.removeEventListener( 'beforeprint', this._updatePrintStyle );
  }

  _getTabClass() {
    const classes = [ 'content_main', this.props.tab.toLowerCase() ]
    return classes.join( ' ' )
  }
  /* eslint complexity: ["error", 5] */
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
        { this.props.printMode && <PrintInfo/> }
        { currentPanel }
        { this.props.printMode && <PrintInfoFooter/> }
      </div>
    )
  }

  _togglePrintStyles() {
    const compProps = this.props;
    compProps.togglePrintMode();
  }
}

const mapStateToProps = state => ( {
  printMode: state.view.printMode,
  tab: state.query.tab
} )

export const mapDispatchToProps = dispatch => ( {
  togglePrintMode: () => {
    dispatch( printModeChanged() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ResultsPanel )
