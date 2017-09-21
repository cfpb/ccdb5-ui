import './SearchPanel.less'
import PillPanel from './PillPanel'
import React from 'react';
import SearchBar from './SearchBar'

export class SearchPanel extends React.Component {
  render() {
    return (
      <div className="search-panel">
        <h2>Search complaint data AHHHHHH</h2>
        <SearchBar />
        <PillPanel />
      </div>
    )
  }
}
export default SearchPanel
