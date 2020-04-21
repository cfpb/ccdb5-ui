import '../RefineBar/RefineBar.less'
import { changeDataLens, changeDateInterval } from '../../actions/filter'
import ActionBar from '../ActionBar'
import BrushChart from '../Charts/BrushChart'
import { connect } from 'react-redux'
import DateRanges from '../RefineBar/DateRanges'
import FilterPanel from '../Filters/FilterPanel'
import FilterPanelToggle from '../Filters/FilterPanelToggle'
import LineChart from '../Charts/LineChart'
import Loading from '../Dialogs/Loading'
import React from 'react'
import RowChart from '../Charts/RowChart'
import { Select } from '../RefineBar/Select'
import StackedAreaChart from '../Charts/StackedAreaChart'

const intervals = [ 'Day', 'Week', 'Month', 'Quarter', 'Year' ]
const lenses = [ 'Overview', 'Company', 'Product', 'Issue' ]

export class TrendsPanel extends React.Component {
  render() {
    return (
      <section className="trends-panel">
        <ActionBar />
        { this.props.showMobileFilters && <FilterPanel/> }
        <div className="layout-row refine-bar">
          <FilterPanelToggle/>
          <Select label={ 'Select the data lens to display' }
                  title={ 'Data Lens' }
                  values={ lenses }
                  id={ 'lens' }
                  value={ this.props.dataLens }
                  handleChange={ this.props.onLens }/>
          <Select label={ 'Choose the Date Interval' }
                  title={ 'Date Interval' }
                  values={ intervals }
                  id={ 'interval' }
                  value={ this.props.dateInterval }
                  handleChange={ this.props.onInterval }/>
          <DateRanges />
        </div>
        { this.props.overview ? <LineChart/> : <StackedAreaChart /> }
        <BrushChart />
        <RowChart aggtype="product" />
        <RowChart aggtype="issue" />
        <Loading isLoading={this.props.isLoading || false} />
      </section>
    )
  }
}

const mapStateToProps = state => ( {
  dataLens: state.query.dataLens,
  overview: state.query.dataLens === 'Overview',
  dateInterval: state.query.dateInterval,
  isLoading: state.trends.isLoading,
  items: state.results.items,
  showMobileFilters: state.view.width < 750
} )

export const mapDispatchToProps = dispatch => ( {
  onInterval: ev => {
    dispatch( changeDateInterval( ev.target.value ) )
  },
  onLens: ev => {
    dispatch( changeDataLens( ev.target.value ) )
  }

} )

export default connect( mapStateToProps, mapDispatchToProps )( TrendsPanel )
