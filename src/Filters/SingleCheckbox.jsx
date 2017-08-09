import { changeFlagFilter } from '../actions/filter'
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

  componentDidUpdate() {
    this.props.changeFlagFilter( this.state.is_checked )
  }

  render() {
    return (
      <section className="single-checkbox">
        <h5>{this.props.title}</h5>
        <div className="m-form-field m-form-field__checkbox">
            <input className="a-checkbox"
                   type="checkbox"
                   onChange={ this._changeFlag.bind( this, this.props.fieldName ) }
                   checked={ this.state.is_checked }
                   value={ this.props.fieldName } />
            <label className="a-label" htmlFor="theCheckbox">Yes</label>
        </div>
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Helper Methods

  _changeFlag( field, event ) {
    const newState = {
      is_checked: !this.state.is_checked
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
  is_checked: typeof state.query.has_narrative !== 'undefined' && (state.query.has_narrative.toString() === 'yes' || state.query.has_narrative.toString() === 'true' )
} )

export const mapDispatchToProps = dispatch => ( {
  changeFlagFilter: is_checked => {
    dispatch( changeFlagFilter( 'has_narrative', is_checked ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( SingleCheckbox )
