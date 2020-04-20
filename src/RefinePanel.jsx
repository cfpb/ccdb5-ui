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
      this.props.showDesktopFilters ?
        <aside className={ this._getTabClass() }>
          <FilterPanel/>
        </aside> : null
    )
  }
}

const mapStateToProps = state => ( {
  tab: state.query.tab,
  showDesktopFilters: state.view.width > 749
} )

export default connect( mapStateToProps )( RefinePanel )
