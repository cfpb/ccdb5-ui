import './Pill.less'
import { connect } from 'react-redux'
import React from 'react'
import { removeFilter } from './actions/filter'
import { SLUG_SEPARATOR } from './constants'

// The linter does not detect the use of 'fieldName' which _is_ used
// eslint-disable-next-line no-unused-vars
export const Pill = ( { fieldName, value, trimmed, remove } ) =>
    <li className="pill flex-fixed">
      <span className="name">{ trimmed }</span>
      <button onClick={ remove }
              title={'Remove ' + trimmed + ' as a filter'}>
          <span className="cf-icon cf-icon-delete"></span>
      </button>
    </li>


export const mapStateToProps = ( state, ownProps ) => {
  const parts = ownProps.value.split( SLUG_SEPARATOR )
  const trimmed = parts.length > 1 ? parts.pop() : parts[0];

  return {
    ...ownProps,
    trimmed
  }
}

export const mapDispatchToProps = ( dispatch, props ) => ( {
  remove: () => { dispatch( removeFilter( props.fieldName, props.value ) ) }
} )

export default connect( mapStateToProps, mapDispatchToProps )( Pill );
