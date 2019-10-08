import './TileChartMap.less';
import { connect } from 'react-redux';
import React from 'react'
import { TileMap } from 'cfpb-chart-builder';

const theData = [
  [
    {'name': 'CA', 'value': 188605},
    {'name': 'FL', 'value': 139157},
    {'name': 'TX', 'value': 117002},
    {'name': 'NY', 'value': 93819},
    {'name': 'GA', 'value': 73452},
    {'name': 'IL', 'value': 53374},
    {'name': 'NJ', 'value': 51017},
    {'name': 'PA', 'value': 47408},
    {'name': 'NC', 'value': 42884},
    {'name': 'OH', 'value': 41269},
    {'name': 'VA', 'value': 39863},
    {'name': 'MD', 'value': 38656},
    {'name': 'MI', 'value': 32336},
    {'name': 'AZ', 'value': 29237},
    {'name': 'WA', 'value': 25990},
    {'name': 'MA', 'value': 24188},
    {'name': 'TN', 'value': 22805},
    {'name': 'CO', 'value': 21741},
    {'name': 'SC', 'value': 20763},
    {'name': 'MO', 'value': 19723},
    {'name': 'NV', 'value': 17648},
    {'name': 'LA', 'value': 16874},
    {'name': 'AL', 'value': 15981},
    {'name': 'IN', 'value': 15358},
    {'name': 'CT', 'value': 15165},
    {'name': 'MN', 'value': 14261},
    {'name': 'WI', 'value': 13983},
    {'name': 'OR', 'value': 13681},
    {'name': 'KY', 'value': 9566},
    {'name': 'UT', 'value': 8953},
    {'name': 'OK', 'value': 8639},
    {'name': 'MS', 'value': 7997},
    {'name': 'DC', 'value': 7366},
    {'name': 'AR', 'value': 6638},
    {'name': 'KS', 'value': 6561},
    {'name': 'DE', 'value': 6519},
    {'name': 'NM', 'value': 5965},
    {'name': 'IA', 'value': 5293},
    {'name': 'NH', 'value': 5076},
    {'name': 'HI', 'value': 4270},
    {'name': 'ID', 'value': 4110},
    {'name': 'RI', 'value': 3979},
    {'name': 'NE', 'value': 3800},
    {'name': 'ME', 'value': 3766},
    {'name': 'WV', 'value': 3189},
    {'name': 'MT', 'value': 2125},
    {'name': 'VT', 'value': 1768},
    {'name': 'SD', 'value': 1617},
    {'name': 'AK', 'value': 1475},
    {'name': 'ND', 'value': 1328},
    {'name': 'WY', 'value': 1252}
  ]
];

const stateNames = theData[ 0 ].map( o => o.name );
console.log(stateNames);

export class TileChartMap extends React.Component {
  constructor( props ) {
    super( props );
    this.state = this._calculatePages( props );
  }

  componentDidMount() {
    console.log(this.state);
    if(!this.state.data) return;

    console.log(JSON.stringify(this.state.data));

    const chart = new TileMap({
      el: document.getElementById('mymap'),
      data: theData,
      type: 'line',
      color: 'green'
    });
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( this._calculatePages( nextProps ) );
  }

  _calculatePages( props ) {
    return {
      data: props.data
    }
  }


  render() {
    return (
      <div>
        <h2 id="section-tilemap">
          TileMap
        </h2>
        <h3>Percentage change in the volume of new auto loans</h3>
        <div id="mymap"
             className="cfpb-chart"
             data-chart-color="navy"
             data-chart-description="This is the chart description."
             data-chart-title="Map about something"
             data-chart-type="tile_map">
          This is the chart description.
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // Helper methods

  // --------------------------------------------------------------------------
  // Subrender methods
}

const mapStateToProps = state => {
  const vals = Object.values( state.aggs.state );
  const d = vals.filter( o => stateNames.includes( o.key ) )
    .map( o => ( { name: o.key, value: o.doc_count } ) );
  return { data: [d]};
};

export default connect( mapStateToProps )( TileChartMap )

