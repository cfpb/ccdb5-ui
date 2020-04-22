import './DateRanges.less'
import { connect } from 'react-redux'
import { dateRanges } from './constants';
import { dateRangeToggled } from './actions/filter';
import React from 'react'


export class DateRanges extends React.Component {
  _setDateRange( page ) {
    this.props.toggleDateRange( page );
  }

  _btnClassName( dateRange ) {
    const classes = [ 'a-btn', 'date-selector', 'range-' + dateRange ]
    if ( dateRange === this.props.dateRange ) {
      classes.push( 'selected' )
    }
    return classes.join( ' ' )
  }

  render() {
    return (
      <section className="date-ranges m-btn-group">
        <p>Date range (Click to modify range)</p>
        { dateRanges.map( dateRange =>
          <button onClick={ () => this._setDateRange( dateRange ) }
                  className={ this._btnClassName( dateRange ) }
                  key={dateRange}>
            {dateRange}
          </button>
        ) }
      </section>
    )
  }
}

export const mapStateToProps = state => ( {
  dateRange: state.query.dateRange
} );

export const mapDispatchToProps = dispatch => ( {
  toggleDateRange: range => {
    dispatch( dateRangeToggled( range ) )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( DateRanges )
