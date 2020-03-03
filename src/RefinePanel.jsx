import { connect } from 'react-redux'
import FilterPanel from './FilterPanel'
import React from 'react'

export class RefinePanel extends React.Component {
  _getTabClass() {
    const classes = [ 'content_sidebar', this.props.tab.toLowerCase() ]
    return classes.join( ' ' )
  }

  render() {
    return (
      <aside className={ this._getTabClass() }>
        <FilterPanel />
      </aside>
    )
  }
}

const mapStateToProps = state => ( {
  tab: state.query.tab
} )

export default connect( mapStateToProps )( RefinePanel )
