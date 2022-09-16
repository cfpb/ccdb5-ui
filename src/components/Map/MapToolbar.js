import './MapToolbar.less';
import { clearStateFilter, showStateComplaints } from '../../actions/map';
import { coalesce } from '../../utils';
import { connect } from 'react-redux';
import iconMap from '../iconMap';
import React from 'react';
import { THESE_UNITED_STATES } from '../../constants';

export class MapToolbar extends React.Component {
  render() {
    const filteredStates = this.props.filteredStates;
    return (
      <div className="map-toolbar">
        <section className="state-heading">
          {!filteredStates && <span>United States of America</span>}
          <span>{filteredStates}</span>
          {filteredStates && (
            <a className="clear" onClick={() => this.props.clearStates()}>
              {iconMap.getIcon('delete-round')}
              Clear
            </a>
          )}
        </section>
        {filteredStates && (
          <section className="state-navigation">
            <a
              href="#"
              className="list"
              onClick={() => this.props.showComplaints()}
            >
              View complaints for filtered states
            </a>
          </section>
        )}
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  const abbrs = coalesce(state.query, 'state', []);

  return {
    filteredStates: abbrs
      .filter((x) => x in THESE_UNITED_STATES)
      .map((x) => THESE_UNITED_STATES[x])
      .join(', '),
  };
};

export const mapDispatchToProps = (dispatch) => ({
  clearStates: () => {
    dispatch(clearStateFilter());
  },
  showComplaints: () => {
    dispatch(showStateComplaints());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapToolbar);
