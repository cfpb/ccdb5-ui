import { connect } from 'react-redux'
import MapPanel from './MapPanel';
import React from 'react'
import ResultsPanel from './ResultsPanel';
import TrendsPanel from './TrendsPanel';

export class Results extends React.Component {
  render() {
    let currentPanel = <MapPanel/>;

    switch ( this.props.tab ) {
      case 'Trends':
        currentPanel = <TrendsPanel/>;
        break;
      case 'List':
        currentPanel = <ResultsPanel/>;
        break;
      case 'Map':
      default:
        currentPanel = <MapPanel/>;
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
