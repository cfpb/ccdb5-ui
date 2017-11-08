import './AggregationBranch.less'
import { addMultipleFilters, removeMultipleFilters } from '../actions/filter'
import { bindAll, slugify } from '../utils'
import AggregationItem from './AggregationItem'
import { connect } from 'react-redux';
import { FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { SLUG_SEPARATOR } from '../constants'

export const UNCHECKED = 'UNCHECKED'
export const INDETERMINATE = 'INDETERMINATE'
export const CHECKED = 'CHECKED'

// ----------------------------------------------------------------------------
// Class

export class AggregationBranch extends React.Component {
  constructor( props ) {
    super( props )

    this.state = { showChildren: props.showChildren }

    bindAll( this, [ '_decideClickAction', '_toggleChildDisplay' ] )
  }

  _decideClickAction() {
    const { item, subitems, fieldName, checkedState } = this.props

    // List all the filters
    const values = [ item.key ]
    subitems.forEach( sub => {
      values.push( slugify( item.key, sub.key ) )
    } )

    const action = checkedState === CHECKED ?
      this.props.uncheckParent :
      this.props.checkParent

    action( fieldName, values )
  }

  _toggleChildDisplay() {
    this.setState( {
      showChildren: !this.state.showChildren
    } )
  }

  render() {
    const { item, subitems, fieldName, checkedState } = this.props

    // Fix up the subitems to prepend the current item key
    const buckets = subitems.map( sub => ( {
      key: slugify( item.key, sub.key ),
      value: sub.key,
      // eslint-disable-next-line camelcase
      doc_count: sub.doc_count
    } ) )

    // Special returns
    if ( buckets.length === 0 ) {
      return <AggregationItem item={item}
                              key={item.key}
                              fieldName={fieldName}
             />
    }

    const liStyle = 'parent m-form-field m-form-field__checkbox body-copy'
    const id = fieldName + item.key.replace( ' ', '' )

    return (
      <div className="aggregation-branch">
        <li className={liStyle}>
          <input type="checkbox"
                 aria-label={item.key}
                 checked={checkedState === CHECKED}
                 className="flex-fixed a-checkbox"
                 id={id}
                 onChange={this._decideClickAction}
          />
          <label className={this._labelStyle}
                 htmlFor={id}>
          </label>
          <button className="flex-all a-btn a-btn__link"
                  onClick={this._toggleChildDisplay}
                  title={item.key}>
            <span>{item.key}</span>
            <span className={ 'cf-icon ' +
              ( this.state.showChildren ? 'cf-icon-up' : 'cf-icon-down' )
            }></span>
          </button>
          <span className="flex-fixed parent-count">
            <FormattedNumber value={item.doc_count} />
          </span>
        </li>
        { this.state.showChildren === false ? null :
          <ul className="children">{
            buckets.map( bucket =>
              <AggregationItem item={bucket}
                               key={bucket.key}
                               fieldName={fieldName}
              />
            )
          }</ul>
        }
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // Properties

  get _labelStyle() {
    let s = 'toggle a-label'
    if ( this.props.checkedState === INDETERMINATE ) {
      s += ' indeterminate'
    }

    return s
  }
}

AggregationBranch.propTypes = {
  checkParent: PropTypes.func.isRequired,
  checkedState: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape( {
    // eslint-disable-next-line camelcase
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string
  } ).isRequired,
  showChildren: PropTypes.bool,
  subitems: PropTypes.array.isRequired,
  uncheckParent: PropTypes.func.isRequired
}

AggregationBranch.defaultProps = {
  checkedState: UNCHECKED,
  showChildren: false
}

export const mapStateToProps = ( state, ownProps ) => {
  // Find all query filters that refer to the field name
  const candidates = state.query[ownProps.fieldName] || []

  // Do any of these values start with the key?
  const hasKey = candidates.filter( x => x.indexOf( ownProps.item.key ) === 0 )

  // Does the key contain the separator?
  const activeChild = hasKey.filter( x => x.indexOf( SLUG_SEPARATOR ) !== -1 )
  const activeParent = hasKey.filter( x => x === ownProps.item.key )

  let checkedState = UNCHECKED
  if ( activeParent.length === 0 && activeChild.length > 0 ) {
    checkedState = INDETERMINATE
  } else if ( activeParent.length > 0 ) {
    checkedState = CHECKED
  }

  return {
    checkedState,
    showChildren: activeChild.length > 0
  }
}

export const mapDispatchToProps = dispatch => ( {
  uncheckParent: ( fieldName, values ) => {
    dispatch( removeMultipleFilters( fieldName, values ) )
  },
  checkParent: ( fieldName, values ) => {
    dispatch( addMultipleFilters( fieldName, values ) )
  }
} )

export default connect(
 mapStateToProps, mapDispatchToProps
)( AggregationBranch )
