import { connect } from 'react-redux';
import FilterPanel from './Filters/FilterPanel';
import PropTypes from 'prop-types';
import React from 'react';

export class RefinePanel extends React.Component {
  _getTabClass() {
    const classes = ['content_sidebar', this.props.tab.toLowerCase()];
    return classes.join(' ');
  }

  render() {
    return this.props.hasDesktopFilters ? (
      <aside className={this._getTabClass()}>
        <FilterPanel />
      </aside>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  tab: state.query.tab,
  hasDesktopFilters: state.view.width > 749,
});

export default connect(mapStateToProps)(RefinePanel);

RefinePanel.propTypes = {
  tab: PropTypes.string.isRequired,
  hasDesktopFilters: PropTypes.bool.isRequired,
};
