import React from 'react';
import SearchBar from './SearchBar'
import PillPanel from './PillPanel'
import './SearchPanel.less'

export const SearchPanel = () =>
    <div className='search-panel'>
      <h2>Search Complaint Data</h2>
      <SearchBar />
      <PillPanel />
    </div>


export default SearchPanel
