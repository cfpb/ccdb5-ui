import { changeFlagFilter } from '../actions/filter'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

export class SingleCheckbox extends React.Component {
  constructor( props ) {
    super( props )

    this.state = { isChecked: this.props.isChecked }
  }

  componentWillReceiveProps( nextProps ) {
    const newState = {
      isChecked: nextProps.isChecked
    }

    this.setState( newState )
  }

  componentDidUpdate() {
    this.props.changeFlagFilter( 'has_narrative', this.state.isChecked )
  }

  render() {
    return (
      <section className="single-checkbox">
        <h5>{this.props.title}</h5>
        <div className="m-form-field m-form-field__checkbox">
            <input className="a-checkbox"
                   id="theCheckbox"
                   type="checkbox"
                   onClick={ this._changeFlag.bind( this, this.props.fieldName ) }
                   checked={ this.state.isChecked }
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
      isChecked: !this.state.isChecked
    }
    newState[field] = event.target.value
    this.setState( newState )
  }
}

// ----------------------------------------------------------------------------
// Meta

SingleCheckbox.propTypes = {
  fieldName: PropTypes.string.isRequired,
  isChecked: PropTypes.bool
}

SingleCheckbox.defaultProps = {
  isChecked: false
}

export const mapStateToProps = state => ( {
  isChecked: typeof state.query.has_narrative !== 'undefined' &&
    ( state.query.has_narrative.toString() === 'yes' ||
      state.query.has_narrative.toString() === 'true' )
} )

export const mapDispatchToProps = dispatch => ( {
  changeFlagFilter: isChecked => {
    dispatch( changeFlagFilter( 'has_narrative', isChecked ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( SingleCheckbox )
