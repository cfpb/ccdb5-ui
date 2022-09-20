import './TileChartMap.less';
import { addStateFilter, removeStateFilter } from '../../actions/map';
import { coalesce, hashObject, sendAnalyticsEvent } from '../../utils';
import { GEO_NORM_NONE, STATE_DATA } from '../../constants';
import { connect } from 'react-redux';
import React from 'react';
import TileMap from './TileMap';

export class TileChartMap extends React.Component {
  componentDidUpdate(prevProps) {
    const props = this.props;
    if (!props.data[0].length) {
      return;
    }

    // force redraw when switching tabs, or print mode changes
    if (
      hashObject(prevProps) !== hashObject(props) ||
      !document.getElementById('tile-chart-map').children.length
    ) {
      this._redrawMap();
    }
  }

  render() {
    return (
      <div>
        <div
          id="tile-chart-map"
          className={'cfpb-chart ' + this.props.printClass}
          data-chart-type="tile_map"
        ></div>
      </div>
    );
  }

  _toggleState(event) {
    // pass in redux dispatch
    // point.fullName
    const compProps = this;
    const { abbr, fullName } = event.point;
    const selectedState = {
      abbr,
      // rename this for consistency
      // chart builder uses fullName
      name: fullName,
    };
    if (compProps.stateFilters.includes(abbr)) {
      compProps.removeState(selectedState);
    } else {
      compProps.addState(selectedState);
    }
  }

  // --------------------------------------------------------------------------
  // Event Handlers

  _redrawMap() {
    const toggleState = this._toggleState;
    const componentProps = this.props;
    const mapElement = document.getElementById('tile-chart-map');
    const { dataNormalization, hasTip } = componentProps;
    const width = mapElement.clientWidth || 700;
    const data = updateData(this.props);

    const options = {
      el: mapElement,
      data,
      isPerCapita: dataNormalization !== GEO_NORM_NONE,
      events: {
        // custom event handlers we can pass on
        click: toggleState.bind(componentProps),
      },
      hasTip,
      width,
    };

    options.height = width * 0.75;

    // eslint-disable-next-line no-unused-vars
    const chart = new TileMap(options);
  }
}

/**
 * helper function to get display value of tile based on selected dropdown.
 * @param {object} props contains data and normalization
 * @returns {object} data provided to tile map
 */
function updateData(props) {
  const { data, dataNormalization } = props;
  const showDefault = dataNormalization === GEO_NORM_NONE;
  const res = data[0].map((o) => ({
    ...o,
    displayValue: showDefault ? o.value : o.perCapita,
  }));

  return res;
}

/**
 * helper function to calculate percapita value
 * @param {object} stateObj a state containing abbr and value
 * @param {object} stateInfo other information about the state
 * @returns {string} the Per 1000 population value
 */
function getPerCapita(stateObj, stateInfo) {
  const pop = stateInfo.population;
  return ((stateObj.value / pop) * 1000).toFixed(2);
}

export const getStateClass = (statesFilter, name) => {
  // no filters so no classes.
  if (statesFilter.length === 0) {
    return '';
  }

  return statesFilter.includes(name) ? 'selected' : 'deselected';
};

export const processStates = (state) => {
  const statesFilter = coalesce(state.query, 'state', []);
  const states = state.map.results.state;
  const stateData = states.map((o) => {
    const stateInfo = coalesce(STATE_DATA, o.name, {
      name: '',
      population: 1,
    });
    o.abbr = o.name;
    o.fullName = stateInfo.name;
    o.perCapita = getPerCapita(o, stateInfo);
    o.className = getStateClass(statesFilter, o.name);
    return o;
  });
  return [stateData];
};

export const mapStateToProps = (state) => {
  const refStateFilters = coalesce(state.query, 'state', []);
  const { isPrintMode, width } = state.view;

  return {
    data: processStates(state),
    dataNormalization: state.query.dataNormalization,
    hasTip: !isPrintMode,
    printClass: isPrintMode ? 'print' : '',
    stateFilters: [...refStateFilters],
    width,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  addState: (selectedState) => {
    sendAnalyticsEvent('State Event: add', selectedState.abbr);
    dispatch(addStateFilter(selectedState));
  },
  removeState: (selectedState) => {
    sendAnalyticsEvent('State Event: remove', selectedState.abbr);
    dispatch(removeStateFilter(selectedState));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TileChartMap);
