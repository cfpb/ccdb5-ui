import './SearchPanel.less';
import { connect } from 'react-redux';
import { FormattedDate } from 'react-intl';
import { PillPanel } from './PillPanel';
import PropTypes from 'prop-types';
import React from 'react';
import { SearchBar } from './SearchBar';

export class SearchPanel extends React.Component {
  render() {
    let lastIndexedMessage = null;

    if (this.props.lastIndexed) {
      lastIndexedMessage = (
        <span className="date-subscript">
          (last updated: <FormattedDate value={this.props.lastIndexed} />)
        </span>
      );
    }

    return (
      <div className="search-panel">
        <h2>Search complaint data {lastIndexedMessage}</h2>
        <SearchBar />
        <PillPanel />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lastIndexed: state.aggs.lastIndexed,
});

// eslint-disable-next-line react-redux/prefer-separate-component-file
export default connect(mapStateToProps)(SearchPanel);

SearchPanel.propTypes = {
  lastIndexed: PropTypes.string,
};
