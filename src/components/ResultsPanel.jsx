import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../constants';
import { printModeOff, printModeOn } from '../actions/view';
import { connect } from 'react-redux';
import ListPanel from './List/ListPanel';
import MapPanel from './Map/MapPanel';
import PrintInfo from './Print/PrintInfo';
import PrintInfoFooter from './Print/PrintInfoFooter';
import React from 'react';
import TrendsPanel from './Trends/TrendsPanel';

export class ResultsPanel extends React.Component {
  constructor( props ) {
    super( props );
    // Bindings
    this._updatePrintStyleOn = this._togglePrintStylesOn.bind( this );
    this._updatePrintStyleOff = this._togglePrintStylesOff.bind( this );
  }

  componentDidMount() {
    window.addEventListener( 'afterprint', this._updatePrintStyleOff );
    window.addEventListener( 'beforeprint', this._updatePrintStyleOn );
  }

  componentWillUnmount() {
    window.removeEventListener( 'afterprint', this._updatePrintStyleOff );
    window.removeEventListener( 'beforeprint', this._updatePrintStyleOn );
  }

  _getTabClass() {
    const classes = [ 'content_main', this.props.tab.toLowerCase() ];
    return classes.join( ' ' );
  }

  /* eslint complexity: ["error", 6] */
  render() {
    let currentPanel;

    switch ( this.props.tab ) {
      case MODE_MAP:
        currentPanel = <MapPanel/>;
        break;
      case MODE_LIST:
        currentPanel = <ListPanel/>;
        break;
      case MODE_TRENDS:
      default:
        currentPanel = <TrendsPanel/>;
        break;
    }

    return (
      <div className={ this._getTabClass() }>
        { this.props.printMode && <PrintInfo/> }
        { currentPanel }
        { this.props.printMode && <PrintInfoFooter/> }
      </div>
    );
  }

  _togglePrintStylesOn() {
    const compProps = this.props;
    compProps.togglePrintModeOn();
  }

  _togglePrintStylesOff() {
    const compProps = this.props;
    compProps.togglePrintModeOff();
  }
}

const mapStateToProps = state => ( {
  printMode: state.view.printMode,
  tab: state.query.tab
} );

export const mapDispatchToProps = dispatch => ( {
  togglePrintModeOn: () => {
    dispatch( printModeOn() );
  },
  togglePrintModeOff: () => {
    dispatch( printModeOff() );
  }

} );

export default connect( mapStateToProps, mapDispatchToProps )( ResultsPanel );
