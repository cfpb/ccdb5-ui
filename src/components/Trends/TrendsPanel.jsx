/* eslint-disable complexity, camelcase */
import '../RefineBar/RefineBar.less'
import './TrendsPanel.less'

import { changeChartType, changeDataLens } from '../../actions/trends'
import { getIntervals, showCompanyOverLay } from '../../utils/trends'
import ActionBar from '../ActionBar'
import BrushChart from '../Charts/BrushChart'
import { changeDateInterval } from '../../actions/filter'
import ChartToggles from '../RefineBar/ChartToggles'
import CompanyTypeahead from '../Filters/CompanyTypeahead'
import { connect } from 'react-redux'
import DateRanges from '../RefineBar/DateRanges'
import ExternalTooltip from './ExternalTooltip'
import FilterPanel from '../Filters/FilterPanel'
import FilterPanelToggle from '../Filters/FilterPanelToggle'
import FocusHeader from './FocusHeader'
import LensTabs from './LensTabs'
import LineChart from '../Charts/LineChart'
import Loading from '../Dialogs/Loading'
import { processRows } from '../../utils/chart'
import React from 'react'
import RowChart from '../Charts/RowChart'
import Select from '../RefineBar/Select'
import Separator from '../RefineBar/Separator'
import StackedAreaChart from '../Charts/StackedAreaChart'
import { trendsDateWarningDismissed } from '../../actions/view'
import Warning from '../Warnings/Warning'

const WARNING_MESSAGE = '“Day” date interval is disabled when date range >' +
  ' 365 days'

const lenses = [ 'Overview', 'Company', 'Product' ]
const subLensMap = {
  sub_product: 'Sub-products',
  sub_issue: 'Sub-issues',
  issue: 'Issues',
  product: 'Products'
}

export class TrendsPanel extends React.Component {
  _areaChartTitle() {
    const { focus, overview, lens, subLens } = this.props
    if ( overview ) {
      return 'Complaints by date received'
    } else if ( focus ) {
      return 'Complaints by ' + subLensMap[subLens].toLowerCase() +
        ' by date received'
    }
    return `Complaints by ${ lens.toLowerCase() } by date received`
  }

  _className() {
    const classes = [ 'trends-panel' ]
    if ( !this.props.overview ) {
      classes.push( 'external-tooltip' )
    }
    return classes.join( ' ' )
  }

  _phaseMap() {
    if ( this.props.overview ) {
      return <RowChart id="product"
                       colorScheme={ this.props.productData.colorScheme }
                       data={ this.props.productData.data }
                       title={ 'Product by highest complaint volume' }
                       total={ this.props.total }/>
    }

    if ( this.props.focus ) {
      return <RowChart id={ this.props.lens }
                       colorScheme={ this.props.focusData.colorScheme }
                       data={ this.props.focusData.data }
                       title={ this.props.subLensTitle }
                       total={ this.props.total }/>
    }

    return [
      <LensTabs key={ 'lens-tab' } showTitle={ true }/>,
      <RowChart id={ this.props.lens }
                colorScheme={ this.props.dataLensData.colorScheme }
                data={ this.props.dataLensData.data }
                title={ this.props.subLensTitle }
                total={ this.props.total }
                key={ this.props.lens + 'row' }/>
    ]
  }

  render() {
    const {
      chartType, companyOverlay, dateInterval, focus, intervals,
      isLoading, lens,
      onInterval, onLens, overview, showMobileFilters, total,
      trendsDateWarningEnabled
    } = this.props
    return (
      <section className={ this._className() }>
        <ActionBar/>
        { trendsDateWarningEnabled &&
            <Warning text={ WARNING_MESSAGE }
                     closeFn={ this.props.onDismissWarning }/> }
        { showMobileFilters && <FilterPanel/> }
        <div className="layout-row refine-bar">
          <FilterPanelToggle/>
          <Select label={ 'Aggregate complaints by' }
                  title={ 'Aggregate by' }
                  values={ lenses }
                  id={ 'lens' }
                  value={ lens }
                  handleChange={ onLens }/>
          <Separator/>
          <Select label={ 'Choose the Date Interval' }
                  title={ 'Date Interval' }
                  values={ intervals }
                  id={ 'interval' }
                  value={ dateInterval }
                  handleChange={ onInterval }/>
          <DateRanges/>
          { !overview && [
            <Separator key={ 'separator' }/>,
            <ChartToggles key={ 'chart-toggles' }/>
          ] }
        </div>

        { companyOverlay &&
        <div className="layout-row company-overlay">
          <section className="company-search">
            <h1>Search for and add companies to visualize data </h1>
            <p>Monocle ipsum dolor sit amet shinkansen delightful tote bag
              handsome, elegant joy ryokan conversation. Sunspel lovely
              signature vibrant boutique the best elegant Airbus A380 concierge
              Baggu izakaya
            </p>
            <CompanyTypeahead/>
          </section>
        </div>
        }

        { focus && <FocusHeader /> }

        { total > 0 &&
        <div className="layout-row">
          <section className="chart">
            { chartType === 'line' &&
            <LineChart title={this._areaChartTitle()}/> }
            { chartType === 'area' &&
            <StackedAreaChart title={this._areaChartTitle()}/> }
            <BrushChart/>
          </section>
          { !overview && <ExternalTooltip/> }
        </div>
        }
        { total > 0 && this._phaseMap() }

        <Loading isLoading={ isLoading || false }/>
      </section>
    )
  }
}

const mapStateToProps = state => {
  const { query, trends } = state
  const {
    company: companyFilters,
    dateInterval,
    date_received_max,
    date_received_min,
    lens,
    subLens,
    trendsDateWarningEnabled
  } = query

  const {
    chartType, colorMap, focus, isLoading, results, total
  } = trends

  const lensKey = lens.toLowerCase()
  const focusKey = subLens.replace( '_', '-' )
  return {
    chartType,
    companyData: processRows( results.company, false ),
    companyOverlay: showCompanyOverLay( lens, companyFilters, isLoading ),
    dateInterval,
    focus,
    focusData: processRows( results[focusKey], colorMap ),
    intervals: getIntervals( date_received_min, date_received_max ),
    isLoading,
    productData: processRows( results.product, false ),
    dataLensData: processRows( results[lensKey], colorMap ),
    lens,
    overview: lens === 'Overview',
    showMobileFilters: state.view.width < 750,
    subLens,
    subLensTitle: subLensMap[subLens] + ' by ' + lens.toLowerCase(),
    total,
    trendsDateWarningEnabled
  }
}

export const mapDispatchToProps = dispatch => ( {
  onChartType: ev => {
    dispatch( changeChartType( ev.target.value ) )
  },
  onDismissWarning: () => {
    dispatch( trendsDateWarningDismissed() )
  },
  onInterval: ev => {
    dispatch( changeDateInterval( ev.target.value ) )
  },
  onLens: ev => {
    dispatch( changeDataLens( ev.target.value ) )
  }

} )

export default connect( mapStateToProps, mapDispatchToProps )( TrendsPanel )
