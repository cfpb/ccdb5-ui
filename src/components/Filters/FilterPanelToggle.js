import './FilterPanelToggle.less';
import { connect } from 'react-redux';
import { filterVisibilityToggled } from '../../actions/view';
import PropTypes from 'prop-types';
import React from 'react';

export class FilterPanelToggle extends React.Component {
  render() {
    return (
      <section className="filter-panel-toggle">
        <div className="m-btn-group">
          <p>&nbsp;</p>
          <button className="a-btn" onClick={() => this.props.onFilterToggle()}>
            {this.props.hasFilters ? 'Close Filters' : 'Filter results'}
          </button>
        </div>
      </section>
    );
  }
}

export const mapStateToProps = (state) => ({
  hasFilters: state.view.hasFilters,
});

export const mapDispatchToProps = (dispatch) => ({
  onFilterToggle: () => {
    dispatch(filterVisibilityToggled());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanelToggle);

FilterPanelToggle.propTypes = {
  onFilterToggle: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool,
};
