import './LensTabs.less'
import { changeDataSubLens } from '../../actions/trends'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const lensMaps = {
  Company: {
    tab1: { displayName: 'Products', filterName: 'product' },
    tab2: { displayName: 'Issues', filterName: 'issue' }
  },
  Issue: {
    tab1: { displayName: 'Sub-issues', filterName: 'sub_issue' },
    tab2: { displayName: 'Products', filterName: 'product' }
  },
  Product: {
    tab1: { displayName: 'Sub-products', filterName: 'sub_product' },
    tab2: { displayName: 'Issues', filterName: 'issue' }
  }
}

export class LensTabs extends React.Component {
  _setTab( tab ) {
    this.props.onTab( tab )
  }

  _getTabClass( tab ) {
    tab = tab.toLowerCase()
    const classes = [ 'tab', tab ]
    const regex = new RegExp( this.props.subLens.toLowerCase(), 'g' )
    if ( tab.replace( '-', '_' ).match( regex ) ) {
      classes.push( 'active' )
    }
    return classes.join( ' ' )
  }

  render() {
    const { lens, showTitle } = this.props
    if ( lens === 'Overview' ) {
      return null
    }

    return (
      <div className="tabbed-navigation lens">
        { showTitle && <h2>{ lens + ' trends for selected criteria' }</h2> }
        <section>
          <button
            className={ this._getTabClass( lensMaps[lens].tab1.filterName ) }
            onClick={ () => this._setTab( lensMaps[lens].tab1.filterName ) }>
            { lensMaps[lens].tab1.displayName }
          </button>

          <button
            className={ this._getTabClass( lensMaps[lens].tab2.filterName ) }
            onClick={ () => this._setTab( lensMaps[lens].tab2.filterName ) }>
            { lensMaps[lens].tab2.displayName }
          </button>
        </section>
      </div>
    )
  }
}

export const mapStateToProps = state => ( {
  lens: state.query.lens,
  subLens: state.query.subLens
} )

export const mapDispatchToProps = dispatch => ( {
  onTab: tab => {
    dispatch( changeDataSubLens( tab.toLowerCase() ) )
  }
} )

LensTabs.propTypes = {
  showTitle: PropTypes.bool.isRequired
}


export default connect( mapStateToProps, mapDispatchToProps )( LensTabs )
