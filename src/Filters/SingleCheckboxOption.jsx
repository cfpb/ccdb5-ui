import { connect } from 'react-redux'
import { filterChanged } from '../actions/filter'
import PropTypes from 'prop-types'
import React from 'react'

export const SingleCheckboxOption = ({ fieldName, active, onClick }) => {
    return (
        <li className="flex-fixed layout-row">
            <input type="checkbox" className="flex-fixed"
                   aria-label="Yes"
                   checked={active}
                   onClick={onClick}
            />
            <span className="flex-all bucket-key">Yes</span>
        </li>
    )
}

SingleCheckboxOption.propTypes = {
  listComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]).isRequired,
  listComponentProps: PropTypes.object,
  options: PropTypes.array.isRequired
}

SingleCheckboxOption.defaultProps = {
  listComponentProps: {},
  showMore: false,
  options: []
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

const SingleCheckboxFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleCheckboxOption)

export default SingleCheckboxFilter