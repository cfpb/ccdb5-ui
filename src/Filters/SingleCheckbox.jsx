import { changeDateRange } from '../actions/filter'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import { shortIsoFormat } from './utils'

export class SingleCheckbox extends React.Component {
  constructor( props ) {
    super( props )

    this.state = { is_checked: this.props.is_checked }
  }

  componentWillReceiveProps( nextProps ) {
    const newState = {
      is_checked: nextProps.is_checked
    }

    this.setState( newState )
  }

  render() {
    console.log(this.state.is_checked)
    return (
      <section className="single-checkbox">
        <h5>{this.props.title}</h5>
        <div className="m-form-field m-form-field__checkbox">
            <input className="a-checkbox"
                   type="checkbox"
                   onChange={this._changeFlag.bind( this, this.props.fieldName )}
                   checked={this.state.is_checked}/>
            <label className="a-label" htmlFor="theCheckbox">Yes</label>
        </div>
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Helper Methods

  _changeFlag( field, event ) {
    const newState = {
      is_checked: this.state.is_checked
    }
    newState[field] = event.target.value
    this.setState( newState )
  }
}

// ----------------------------------------------------------------------------
// Meta

SingleCheckbox.propTypes = {
  fieldName: PropTypes.string.isRequired,
  is_checked: PropTypes.bool
}

SingleCheckbox.defaultProps = {
  is_checked: false
}

export const mapStateToProps = state => ( {
  is_checked: state.query.has_narrative ? true : false
} )

export const mapDispatchToProps = dispatch => ( {
  changeDateRange: ( from, through ) => {
    dispatch( changeDateRange( 'date_received', from, through ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( SingleCheckbox )
