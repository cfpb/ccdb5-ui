import '../RefineBar/RefineBar.less'
import ActionBar from '../ActionBar'
import { connect } from 'react-redux'
import DateRanges from '../RefineBar/DateRanges'
import ErrorBlock from '../warnings/Error'
import FilterPanel from '../Filters/FilterPanel'
import FilterPanelToggle from '../Filters/FilterPanelToggle'
import Loading from '../Dialogs/Loading'
import MapToolbar from './MapToolbar'
import { mapWarningDismissed } from '../../actions/view'
import PerCapita from '../RefineBar/PerCapita'
import React from 'react'
import RowChart from '../Charts/RowChart'
import { Separator } from '../RefineBar/Separator'
import StaleDataWarnings from '../warnings/StaleDataWarnings'
import TileChartMap from '../Charts/TileChartMap'
import Warning from '../warnings/Warning'


const WARNING_MESSAGE = '“Complaints per' +
  ' 1,000 population” is not available with your filter selections.'

export class MapPanel extends React.Component {
  // eslint-disable-next-line complexity
  render() {
    return (
      <section className="map-panel">
        <ActionBar/>
        <StaleDataWarnings />
        { this.props.error &&
          <ErrorBlock text="There was a problem executing your search" />
        }
        { this.props.showWarning &&
          <Warning text={ WARNING_MESSAGE }
                   closeFn={this.props.onDismissWarning}/> }
        { this.props.showMobileFilters && <FilterPanel/> }
        <div className="layout-row refine-bar">
          <FilterPanelToggle/>
          <Separator />
          <DateRanges/>
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
  isLoading: state.map.isLoading,
  showMobileFilters: state.view.width < 750,
  showWarning: !state.query.enablePer1000 && state.query.mapWarningEnabled
} )

export const mapDispatchToProps = dispatch => ( {
  onDismissWarning: () => {
    dispatch( mapWarningDismissed() )
  }
} )


export default connect( mapStateToProps, mapDispatchToProps )( MapPanel )
