import './SearchPanel.less';
import { FormattedDate } from 'react-intl';
import { PillPanel } from './PillPanel';
import React from 'react';
import { SearchBar } from './SearchBar';
import { selectAggsLastIndexed } from '../../reducers/aggs/selectors';
import {connect, useSelector} from 'react-redux';
import PropTypes from "prop-types";

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
  }

const mapStateToProps = (state) => ({
  lastIndexed: state.aggs.lastIndexed,
});

// eslint-disable-next-line react-redux/prefer-separate-component-file
export default connect(mapStateToProps)(SearchPanel);

SearchPanel.propTypes = {
  lastIndexed: PropTypes.string,
};
