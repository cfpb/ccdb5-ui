import './SearchPanel.less'
import PillPanel from './PillPanel'
import React from 'react';
import SearchBar from './SearchBar'

export const SearchPanel = () =>
    <div className="search-panel">
      <h2>Search complaint data</h2>
      <SearchBar />
      <PillPanel />
    </div>


export default SearchPanel
