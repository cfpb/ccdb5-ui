import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { toggleFilter } from '../../actions/filter'

export const AggregationItem = ( { item, fieldName, active, onClick } ) => {
  const value = item.value || item.key
  const liStyle = 'layout-row m-form-field m-form-field__checkbox'
  const id = fieldName + item.key.replace( ' ', '' )
  return (
        <li className={liStyle}>
            <input type="checkbox" className="flex-fixed a-checkbox"
                   aria-label={item.key}
                   disabled={item.disabled}
                   checked={active}
                   id={id}
                   onChange={onClick}
            />
            <label className="a-label flex-all bucket-key body-copy"
                   htmlFor={id}>
              {value}
            </label>
            <span className="flex-fixed bucket-count">
              <FormattedNumber value={item.doc_count} />
            </span>
        </li>
  )
}

AggregationItem.propTypes = {
  active: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape( {
    // eslint-disable-next-line camelcase
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string
  } ).isRequired,
  onClick: PropTypes.func.isRequired
}

AggregationItem.defaultProps = {
  active: false
}

export const mapStateToProps = ( state, ownProps ) => {
  const field = state.query[ownProps.fieldName]
  const value = ownProps.item.key
  const active = typeof field !== 'undefined' && field.indexOf( value ) > -1
  return { active }
}

export const mapDispatchToProps = ( dispatch, ownProps ) => ( {
  onClick: () => {
    dispatch( toggleFilter( ownProps.fieldName, ownProps.item ) )
  }
} )

const AggregationItemFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)( AggregationItem )

export default AggregationItemFilter
