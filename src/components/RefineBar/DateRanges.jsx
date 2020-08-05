import './DateRanges.less'
import { connect } from 'react-redux'
import { dateRanges } from '../../constants'
import { dateRangeToggled } from '../../actions/filter'
import React from 'react'
import { sendAnalyticsEvent } from '../../utils'

export class DateRanges extends React.Component {
  _btnClassName( dateRange ) {
    const classes = [ 'a-btn', 'date-selector', 'range-' + dateRange ]
    if ( dateRange === this.props.dateRange ) {
      classes.push( 'selected' )
    }
    return classes.join( ' ' )
  }

  _toggleDateRange( dateRange ) {
    if ( this.props.dateRange !== dateRange ) {
      this.props.toggleDateRange( dateRange, this.props.tab )
    }
  }

  render() {
    return (
      <section className="date-ranges m-btn-group">
        <p>Date range (Click to modify range)</p>
        { dateRanges.map( dateRange =>
          <button onClick={ () => {
            this._toggleDateRange( dateRange )
          } }
                  className={ this._btnClassName( dateRange ) }
                  key={ dateRange }>
            { dateRange }
          </button>
        ) }
      </section>
    )
  }
}

export const mapStateToProps = state => ( {
  dateRange: state.query.dateRange,
  tab: state.query.tab
} )

export const mapDispatchToProps = dispatch => ( {
  toggleDateRange: ( range, tab ) => {
    sendAnalyticsEvent( 'Button', tab + ':' + range )
    dispatch( dateRangeToggled( range ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( DateRanges )
