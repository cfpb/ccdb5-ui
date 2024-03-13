import './FilterPanelToggle.less';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { updateFilterVisibility } from '../../reducers/view/viewSlice';

export class FilterPanelToggle extends React.Component {
  render() {
    return this.props.isPrintMode ? null : (
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
  isPrintMode: state.view.isPrintMode,
});

export const mapDispatchToProps = (dispatch) => ({
  onFilterToggle: () => {
    dispatch(updateFilterVisibility());
  },
});

// eslint-disable-next-line react-redux/prefer-separate-component-file
export default connect(mapStateToProps, mapDispatchToProps)(FilterPanelToggle);

FilterPanelToggle.propTypes = {
  onFilterToggle: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool,
  isPrintMode: PropTypes.bool,
};
