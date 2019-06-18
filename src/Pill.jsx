import './Pill.less'
import { connect } from 'react-redux'
import React from 'react'
import { removeFilter } from './actions/filter'
import { SLUG_SEPARATOR } from './constants'

// The linter does not detect the use of 'fieldName' which _is_ used.
// eslint-disable-next-line no-unused-vars
export const Pill = ( { fieldName, value, trimmed, remove } ) =>
    <li className="pill flex-fixed">
      <span className="name">{ trimmed }</span>
      <button onClick={ remove }
              title={'Remove ' + trimmed + ' as a filter'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 718.9 1200" class="cf-icon-svg"><path d="M451.4 613.7l248.1-248.1c25.6-25.1 26-66.3.8-91.9s-66.3-26-91.9-.8l-.8.8-248.1 248.1-248.1-248.1c-25.4-25.4-66.5-25.4-91.9 0s-25.4 66.5 0 91.9l248.1 248.1L19.5 861.8c-25.6 25.1-26 66.3-.8 91.9s66.3 26 91.9.8l.8-.8 248.1-248.1 248.1 248.1c25.4 25.4 66.5 25.4 91.9 0s25.4-66.5 0-91.9L451.4 613.7z"></path></svg>
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
