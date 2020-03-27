import { connect } from 'react-redux'
import FilterPanel from './FilterPanel'
import iconMap from './iconMap'
import React from 'react'

export class RefinePanel extends React.Component {
  _getTabClass() {
    const classes = [ 'content_sidebar', this.props.tab.toLowerCase() ]
    return classes.join( ' ' )
  }

  render() {
    return (
      <aside className={ this._getTabClass() }>
         <div className="filter-button"><button class="a-btn" title="Filter results">
           Close filters { iconMap.getIcon( 'delete' ) }</button></div>
        <FilterPanel />
      </aside>
    )
  }
}

const mapStateToProps = state => ( {
  tab: state.query.tab
} )

export default connect( mapStateToProps )( RefinePanel )
