import './PerCapita.less'
import { connect } from 'react-redux'
import { dateIntervalToggled } from './actions/filter';
import React from 'react'


export class PerCapita extends React.Component {
  _setDateInterval( page ) {
    this.props.toggleDateInterval( page );
  }

  render() {
    return (
      <section className="per-capita">
        <p>Map Shading</p>
        <select>
          <option>Complaints</option>
          <option>Per capita</option>
        </select>
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

export default connect( mapStateToProps, mapDispatchToProps )( PerCapita )
