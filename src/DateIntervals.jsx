import './DateIntervals.less'
import { changeDateInterval } from './actions/filter';
import { connect } from 'react-redux'
import { dateIntervals } from './constants';
import React from 'react'


export class DateIntervals extends React.Component {
  _setDateInterval( page ) {
    this.props.toggleDateInterval( page );
  }

  _btnClassName( dateInterval ) {
    const btnClass = 'date-selector ';
    return dateInterval === this.props.dateInterval ?
      btnClass + 'selected' : btnClass;
  }

  render() {
    return (
      <section className="date-intervals">
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
  dateInterval: state.view.dateInterval
} );

export const mapDispatchToProps = dispatch => ( {
  toggleDateInterval: interval => {
    dispatch( changeDateInterval( interval ) )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( DateIntervals )
