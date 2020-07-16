import './ChartToggles.less'
import { changeChartType } from '../../actions/trends'
import { connect } from 'react-redux'
import iconMap from '../iconMap'
import React from 'react'

export class ChartToggles extends React.Component {
  _toggleChartType( chartType ) {
    this.props.toggleChartType( chartType )
  }

  _btnClassName( chartType ) {
    const classes = [ 'a-btn', 'toggle', chartType ]
    if ( chartType === this.props.chartType ) {
      classes.push( 'selected' )
    }
    return classes.join( ' ' )
  }

  render() {
    return (
      <section className="chart-toggles m-btn-group">
        <p>Chart type</p>
        <button onClick={ () => this._toggleChartType( 'line' ) }
                className={ this._btnClassName( 'line' ) }>
          { iconMap.getIcon( 'line-chart' ) }
        </button>
        <button onClick={ () => this._toggleChartType( 'area' ) }
                className={ this._btnClassName( 'area' ) }>
          { iconMap.getIcon( 'area-chart' ) }
        </button>
      </section>
    )
  }
}

export const mapStateToProps = state => ( {
  chartType: state.trends.chartType
} )

export const mapDispatchToProps = dispatch => ( {
  toggleChartType: chartType => {
    dispatch( changeChartType( chartType ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ChartToggles )
