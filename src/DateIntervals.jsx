import './DateIntervals.less'
import { connect } from 'react-redux'
import { dateIntervals } from './constants';
import { dateIntervalToggled } from './actions/filter';
import React from 'react'


export class DateIntervals extends React.Component {
  _setDateInterval( page ) {
    this.props.toggleDateInterval( page );
  }

  _btnClassName( dateInterval ) {
    const btnClass = 'date-selector interval-' + dateInterval
    return dateInterval === this.props.dateInterval ?
      btnClass + ' selected' : btnClass
  }

  render() {
    return (
      <section className="date-intervals">
        <p>Date range (Click to modify range)</p>
        { dateIntervals.map( dateInterval =>
          <button onClick={ () => this._setDateInterval( dateInterval ) }
                  className={ this._btnClassName( dateInterval ) }
                  key={dateInterval}>
            {dateInterval}
          </button>
        ) }
      </section>
    )
  }
}

export const mapStateToProps = state => ( {
  dateInterval: state.query.dateInterval
} );

export const mapDispatchToProps = dispatch => ( {
  toggleDateInterval: interval => {
    dispatch( dateIntervalToggled( interval ) )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( DateIntervals )
