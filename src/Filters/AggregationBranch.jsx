import './AggregationBranch.less'
import { addMultipleFilters, removeMultipleFilters } from '../actions/filter'
import AggregationItem from './AggregationItem'
import { connect } from 'react-redux';
import { FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { SLUG_SEPARATOR } from '../constants'
import { slugify } from '../utils'

export class AggregationBranch extends React.Component {
  constructor( props ) {
    super( props )

    this.state = { showChildren: this.props.showChildren }

    this.refCheckbox = null

    this._decideClickAction = this._decideClickAction.bind( this )
    this._setReference = this._setReference.bind( this )
    this._toggleChildDisplay = this._toggleChildDisplay.bind( this )
  }

  _decideClickAction() {
    const { item, subitems, fieldName, active } = this.props

    // List all the filters
    const values = [ item.key ]
    subitems.forEach( sub => {
      values.push( slugify( item.key, sub.key ) )
    } )

    const action = active ? this.props.uncheckParent : this.props.checkParent
    action( fieldName, values )
  }

  _setReference( elem ) {
    this.refCheckbox = elem
  }

  _toggleChildDisplay() {
    this.setState( {
      showChildren: !this.state.showChildren
    } )
  }

  componentDidUpdate() {
    if ( this.refCheckbox ) {
      this.refCheckbox.indeterminate = this.props.indeterminate
    }
  }

  render() {
    const { item, subitems, fieldName, active } = this.props

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

    const liStyle = 'flex-fixed layout-row parent m-form-field ' +
      'm-form-field__checkbox'
    const id = fieldName + item.key.replace( ' ', '' )

    return (
      <div className="aggregation-branch">
        <li className={liStyle}>
          <input type="checkbox"
                 aria-label={item.key}
                 checked={active}
                 className="flex-fixed a-checkbox"
                 id={id}
                 onChange={this._decideClickAction}
                 ref={this._setReference}
          />
          <label className="flex-all toggle a-label"
                 htmlFor={id}>
            <button className="a-btn a-btn__link hover"
                    onClick={this._toggleChildDisplay}>
              <span>{item.key}</span>
              <span className={ 'cf-icon ' +
                ( this.state.showChildren ? 'cf-icon-up' : 'cf-icon-down' )
              }></span>
            </button>
          </label>
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
}

AggregationBranch.propTypes = {
  active: PropTypes.bool,
  checkParent: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  indeterminate: PropTypes.bool,
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
  active: false,
  indeterminate: false,
  showChildren: false
}

export const mapStateToProps = ( state, ownProps ) => {
  // Find all query filters that refer to the field name
  const candidates = state.query[ownProps.fieldName] || []

  // Do any of these values contain the key?
  const hasKey = candidates.filter( x => x.indexOf( ownProps.item.key ) !== -1 )

  // Does the key contain the separator?
  const activeChild = hasKey.filter( x => x.indexOf( SLUG_SEPARATOR ) !== -1 )
  const activeParent = hasKey.filter( x => x.indexOf( SLUG_SEPARATOR ) === -1 )

  return {
    active: activeParent.length > 0,
    indeterminate: activeParent.length === 0 && activeChild.length > 0,
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
