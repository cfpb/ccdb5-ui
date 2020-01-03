import './MapPanel.less'
import ActionBar from './ActionBar'
import { connect } from 'react-redux'
import DateIntervals from './DateIntervals';
import Loading from './Dialogs/Loading'
import React from 'react'
import TileChartMap from './TileChartMap';

export class MapPanel extends React.Component {
  render() {
    return (
      <section className="map-panel">
        <ActionBar/>
        <DateIntervals/>
        <TileChartMap/>
        <Loading isLoading={ this.props.isLoading || false }/>
      </section>
    )
  }
}

const mapStateToProps = state => ( {
  isLoading: state.results.isLoading,
  items: state.results.items
} )

export default connect( mapStateToProps )( MapPanel )
