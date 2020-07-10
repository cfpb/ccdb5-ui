/* eslint-disable complexity, camelcase */
import '../RefineBar/RefineBar.less'
import './TrendsPanel.less'

import { changeChartType, changeDataLens } from '../../actions/trends'
import { getIntervals, showCompanyOverLay } from '../../utils/trends'
import ActionBar from '../ActionBar'
import { changeDateInterval } from '../../actions/filter'
import ChartToggles from '../RefineBar/ChartToggles'
import CompanyTypeahead from '../Filters/CompanyTypeahead'
import { connect } from 'react-redux'
import DateRanges from '../RefineBar/DateRanges'
import ExternalTooltip from './ExternalTooltip'
import FilterPanel from '../Filters/FilterPanel'
import FilterPanelToggle from '../Filters/FilterPanelToggle'
import FocusHeader from './FocusHeader'
import { formatDateView } from '../../utils/formatDate'
import LensTabs from './LensTabs'
import LineChart from '../Charts/LineChart'
import Loading from '../Dialogs/Loading'
import { processRows } from '../../utils/chart'
import React from 'react'
import RowChart from '../Charts/RowChart'
import Select from '../RefineBar/Select'
import Separator from '../RefineBar/Separator'
import StackedAreaChart from '../Charts/StackedAreaChart'
import TrendDepthToggle from './TrendDepthToggle'
import { trendsDateWarningDismissed } from '../../actions/view'
import Warning from '../Warnings/Warning'

const WARNING_MESSAGE = '“Day” interval is disabled when the date range is' +
  ' longer than one year'

const lenses = [ 'Overview', 'Company', 'Product' ]
const subLensMap = {
  sub_product: 'Sub-products',
  sub_issue: 'Sub-issues',
  issue: 'Issues',
  product: 'Products'
}

const lensHelperTextMap = {
  product: 'Product the consumer identified in the complaint.' +
  ' Click on a company name to expand products.',
  company: 'Product the consumer identified in the complaint. Click on' +
  ' a company name to expand products.',
  sub_product: 'Product and sub-product the consumer identified in the ' +
  ' complaint. Click on a product to expand sub-products.',
  issue: 'Product and issue the consumer identified in the complaint.' +
  ' Click on a product to expand issues.',
  overview: 'Product the consumer identified in the complaint. Click on a ' +
  ' product to expand sub-products'
}

const focusHelperTextMap = {
  sub_product: 'Sub-products the consumer identified in the complaint',
  product: 'Product the consumer identified in the complaint',
  issue: 'Issues the consumer identified in the complaint'
}

export class TrendsPanel extends React.Component {
  _areaChartTitle() {
    const { focus, overview, subLens } = this.props
    if ( overview ) {
      return 'Complaints by date received by the CFPB'
    } else if ( focus ) {
      return 'Complaints by ' + subLensMap[subLens].toLowerCase() +
       ', by date received by the CFPB'
    }
    return 'Complaints by date received by the CFPB'
  }

  _className() {
    const classes = [ 'trends-panel' ]
    if ( !this.props.overview ) {
      classes.push( 'external-tooltip' )
    }
    return classes.join( ' ' )
  }

  _phaseMap() {
    const {
      companyOverlay, dataLensData, focusData, focusHelperText, overview, lens,
      lensHelperText, minDate, maxDate, productData, subLensTitle, total
    } = this.props

    if ( companyOverlay ) {
      return null
    }

    if ( overview ) {
      return <RowChart id="product"
                       colorScheme={ productData.colorScheme }
                       data={ productData.data }
                       title={ 'Product by highest complaint volume ' +
                        minDate + ' to ' + maxDate}
                       helperText={ lensHelperText }
                       total={ total }/>
    }

    if ( this.props.focus ) {
      return <RowChart id={ lens }
                       colorScheme={ focusData.colorScheme }
                       data={ focusData.data }
                       title={ subLensTitle + ' ' + minDate + ' to ' + maxDate }
                       helperText={ focusHelperText }
                       total={ total }/>
    }

    return [
      <LensTabs key={ 'lens-tab' } showTitle={ true }/>,
      <RowChart id={ lens }
                colorScheme={ dataLensData.colorScheme }
                data={ dataLensData.data }
                title={ subLensTitle + ' ' +
                 minDate + ' to ' + maxDate }
                helperText={ lensHelperText}
                total={ total }
                key={ lens + 'row' }/>
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
          <Select label={ 'Choose the Date interval' }
                  title={ 'Date interval' }
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
              <p>Choose a company to start your visualization
               using the type-ahead menu below. You can add more than
                one company to your view
              </p>
              <CompanyTypeahead/>
            </section>
          </div>
        }

        { focus && <FocusHeader /> }

        { !companyOverlay && total > 0 &&
          <div className="layout-row">
            <section className="chart">
              <h2 className="area-chart-title">{this._areaChartTitle()}</h2>
              <p className="chart-helper-text">A time series graph of the
              (up to) five highest volume complaint counts for the selected
               date range. Hover on the chart to see the count for each date interval.
                  Your filter selections will update what you see on the
                   graph.</p>
            </section>
          </div>
        }

        { !companyOverlay && total > 0 &&
          <div className="layout-row">
            <section className="chart">
              { chartType === 'line' &&
              <LineChart /> }
              { chartType === 'area' &&
              <StackedAreaChart /> }
            </section>
            { !overview && <ExternalTooltip/> }
          </div>
        }
        { total > 0 && this._phaseMap() }
        <TrendDepthToggle />
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
  const lensHelperText = subLens === '' ?
   lensHelperTextMap[lensKey] : lensHelperTextMap[subLens]
  const focusHelperText = subLens === '' ?
   focusHelperTextMap[lensKey] : focusHelperTextMap[subLens]

  const minDate = formatDateView( date_received_min )
  const maxDate = formatDateView( date_received_max )

  return {
    chartType,
    companyData: processRows( results.company, false, lens ),
    companyOverlay: showCompanyOverLay( lens, companyFilters, isLoading ),
    dateInterval,
    focus,
    focusData: processRows( results[focusKey], colorMap, lens ),
    intervals: getIntervals( date_received_min, date_received_max ),
    isLoading,
    productData: processRows( results.product, false, lens ),
    dataLensData: processRows( results[lensKey], colorMap, lens ),
    lens,
    maxDate,
    minDate,
    overview: lens === 'Overview',
    showMobileFilters: state.view.width < 750,
    subLens,
    subLensTitle: subLensMap[subLens] + ', by ' + lens.toLowerCase() + ' from',
    lensHelperText: lensHelperText,
    focusHelperText: focusHelperText,
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
