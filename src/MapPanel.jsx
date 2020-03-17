import './MapPanel.less'
import ActionBar from './ActionBar'
import { connect } from 'react-redux'
import DateIntervals from './DateIntervals'
import ErrorBlock from './Error'
import Loading from './Dialogs/Loading'
import MapToolbar from './MapToolbar'
import PerCapita from './PerCapita'
import React from 'react'
import RowChart from './RowChart'
import TileChartMap from './TileChartMap'

export class MapPanel extends React.Component {
  render() {
    return (
      <section className="map-panel">
        <ActionBar/>
        { this.props.error &&
          <ErrorBlock text="There was a problem executing your search" />
        }
        <div className="layout-row refine">
          <DateIntervals/>
          <PerCapita/>
        </div>
        <TileChartMap/>
        <MapToolbar/>
        <RowChart aggtype="product" />
        <RowChart aggtype="issue" />
        <Loading isLoading={ this.props.isLoading || false }/>
      </section>
    )
  }
}

const mapStateToProps = state => ( {
  error: state.map.error,
  isLoading: state.map.isLoading
} )

export default connect( mapStateToProps )( MapPanel )
