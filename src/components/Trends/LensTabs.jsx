import './LensTabs.less'
import { changeDataSubLens } from '../../actions/trends'
import { connect } from 'react-redux'
import React from 'react'

const lensMaps = {
  Product: 'Issue',
  Issue: 'Product'
}

export class LensTabs extends React.Component {
  _setTab( tab ) {
    this.props.onTab( tab )
  }

  _getTabClass( tab ) {
    tab = tab.toLowerCase()
    const tabName = tab + ' tab'
    return this.props.subLens === tab ? tabName + ' active' : tabName
  }

  render() {
    return (
      <div className="tabbed-navigation lens">
        <h2>{ this.props.lens + ' trends for selected criteria' }</h2>
        <section>
          <button
            className={ this._getTabClass( 'sub_' + this.props.lens ) }
            onClick={ () => this._setTab( 'sub_' + this.props.lens ) }>
            { 'Sub-' + this.props.lens.toLowerCase() + 's' }
          </button>

          <button
            className={ this._getTabClass( lensMaps[this.props.lens] ) }
            onClick={ () => this._setTab( lensMaps[this.props.lens] ) }>
            { lensMaps[this.props.lens] + 's' }
          </button>
        </section>
      </div>
    )
  }
}

export const mapStateToProps = state => ( {
  lens: state.query.lens,
  subLens: state.query.subLens,
  tab: state.query.tab
} )

export const mapDispatchToProps = dispatch => ( {
  onTab: tab => {
    dispatch( changeDataSubLens( tab.toLowerCase() ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( LensTabs )
