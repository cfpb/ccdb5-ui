import './SearchPanel.less';
import { FormattedDate } from 'react-intl';
import { PillPanel } from './PillPanel';
import React from 'react';
import { SearchBar } from './SearchBar';
import { useSelector } from 'react-redux';
import { selectAggsLastIndexed } from '../../reducers/aggs/selectors';

export const SearchPanel = () => {
  const lastIndexed = useSelector(selectAggsLastIndexed);

  const lastIndexedMessage = (
    <span className="date-subscript">
      (last updated: <FormattedDate value={lastIndexed} />)
    </span>
  );

  return (
    <div className="search-panel">
      <h2>Search complaint data {lastIndexedMessage}</h2>
      <SearchBar />
      <PillPanel />
    </div>
  );
};
