import '../RefineBar/RefineBar.less'
import './TrendsPanel.less'

import { changeChartType, changeDataLens } from '../../actions/trends'
import ActionBar from '../ActionBar'
import BrushChart from '../Charts/BrushChart'
import { changeDateInterval } from '../../actions/filter'
import { connect } from 'react-redux'
import DateRanges from '../RefineBar/DateRanges'
import ExternalTooltip from './ExternalTooltip'
import FilterPanel from '../Filters/FilterPanel'
import FilterPanelToggle from '../Filters/FilterPanelToggle'
import LensTabs from './LensTabs'
import LineChart from '../Charts/LineChart'
import Loading from '../Dialogs/Loading'
import { processRows } from '../../utils/chart'
import React from 'react'
import RowChart from '../Charts/RowChart'
import { Select } from '../RefineBar/Select'
import { Separator } from '../RefineBar/Separator'
import StackedAreaChart from '../Charts/StackedAreaChart'

const intervals = [ 'Day', 'Week', 'Month', 'Quarter', 'Year' ]
const lenses = [ 'Overview', 'Company', 'Product', 'Issue' ]

export class TrendsPanel extends React.Component {
  _className() {
    const classes = [ 'trends-panel' ]
    if ( !this.props.overview ) {
      classes.push( 'external-tooltip' )
    }
    return classes.join( ' ' )
  }

  render() {
    return (
      <section className={this._className()}>
        <ActionBar />
        { this.props.showMobileFilters && <FilterPanel/> }
        <div className="layout-row refine-bar">
          <FilterPanelToggle/>
          <Select label={ 'Aggregate complaints by' }
                  title={ 'Aggregate by' }
                  values={ lenses }
                  id={ 'lens' }
                  value={ this.props.lens }
                  handleChange={ this.props.onLens }/>
          <Separator />
          <Select label={ 'Choose the Date Interval' }
                  title={ 'Date Interval' }
                  values={ intervals }
                  id={ 'interval' }
                  value={ this.props.dateInterval }
                  handleChange={ this.props.onInterval }/>
          { !this.props.overview && <Select label={ 'Chart Type' }
                                            title={ 'Chart Type' }
                                            values={ [ 'line', 'area' ] }
                                            id={ 'chart-type' }
                                            value={ this.props.chartType }
                                            handleChange={ this.props.onChartType }/>
          }
          <DateRanges />
        </div>
        <div className="layout-row">
          <section className="chart">
            { this.props.chartType === 'line' &&
              <LineChart title="Complaints by date received"/> }
            { this.props.chartType === 'area' &&
              <StackedAreaChart title="Complaints by date received"/> }
            <BrushChart/>
          </section>
          { !this.props.overview && <ExternalTooltip/> }
        </div>
        { this.props.overview &&
        <RowChart id="product"
                  colorScheme={this.props.productData.colorScheme}
                  data={this.props.productData.data}
                  title="Product by highest complaint volume"/> }
        { this.props.overview &&
        <RowChart id="issue"
                  colorScheme={this.props.issueData.colorScheme}
                  data={this.props.issueData.data}
                  title="Issue by highest complaint volume"/> }
        { !this.props.overview && <LensTabs /> }
        { !this.props.overview &&
          <RowChart id={ this.props.lens }
                    colorScheme={this.props.dataLensData.colorScheme}
                    data={this.props.dataLensData.data}
                    title={ this.props.subLensTitle }/> }
        <Loading isLoading={this.props.isLoading || false} />
      </section>
    )
  }
}

const subLensMap = {
  sub_product: 'Sub-products',
  sub_issue: 'Sub-issues',
  issue: 'Issues',
  product: 'Products'
}

const mapStateToProps = state => {
  const { query, trends } = state
  const {
    dateInterval,
    issue: issueFilters,
    product: productFilters,
    lens,
    subLens
  } = query

  const lensKey = lens.toLowerCase()
  const dataLensFilters = query[lensKey]
  const { chartType, colorMap, isLoading, results } = trends

  return {
    chartType,
    dateInterval,
    isLoading,
    issueData: processRows( issueFilters, results.issue, false ),
    productData: processRows( productFilters, results.product, false ),
    dataLensData: processRows( dataLensFilters, results[lensKey], colorMap ),
    lens,
    overview: lens === 'Overview',
    showMobileFilters: state.view.width < 750,
    subLens,
    subLensTitle: subLensMap[subLens] + ' by ' + lens.toLowerCase()
  }
}

export const mapDispatchToProps = dispatch => ( {
  onChartType: ev => {
    dispatch( changeChartType( ev.target.value ) )
  },
  onInterval: ev => {
    dispatch( changeDateInterval( ev.target.value ) )
  },
  onLens: ev => {
    dispatch( changeDataLens( ev.target.value ) )
  }

} )

export default connect( mapStateToProps, mapDispatchToProps )( TrendsPanel )
