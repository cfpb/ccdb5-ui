import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import { filterChanged } from '../actions/filter'

export const AggregationItem = ({ item, fieldName, active, onClick }) => {
    const value = item.value || item.key

    return (
        <li className="flex-fixed layout-row">
            <input type="checkbox" className="flex-fixed"
                   aria-label={item.key}
                   checked={active}
                   onClick={onClick}
            />
            <span className="flex-all bucket-key">{value}</span>
            <span className="flex-fixed bucket-count">
              <FormattedNumber value={item.doc_count} />
            </span>
        </li>
    )
}

AggregationItem.propTypes = {
  active: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape({
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

AggregationItem.defaultProps = {
  active: false
}

export const mapStateToProps = (state, ownProps) => {
  return {
    active: typeof state.query[ownProps.fieldName] !== 'undefined' && state.query[ownProps.fieldName].indexOf(ownProps.item.key) > -1
  }
}

export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(filterChanged(ownProps.fieldName, ownProps.item))
    },
  }
}

const AggregationItemFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(AggregationItem)

export default AggregationItemFilter
