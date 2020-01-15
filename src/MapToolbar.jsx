import './MapToolbar.less'
import { connect } from 'react-redux'
import React from 'react'
import { tabChanged } from './actions/view'

export class MapToolbar extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      tab: props.tab
    };
  }

  _setTab( tab ) {
    window.scrollTo( 0, 0 )
    this.props.onTab( tab );
  }


  render() {
    return (
      <div className="mapToolbar">
        <section>
          <button className="map"
                  onClick={() => this._setTab( 'Map' )}>
            View narratives from Texas
          </button>

          <button className="list"
                  onClick={() => this._setTab( 'List' )}>
            View trends from Texas
          </button>
          <button className="list"
                  onClick={() => this._setTab( 'List' )}>
            Add Texas to filters
          </button>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ( {
  tab: state.map.selectedState
} )

export const mapDispatchToProps = dispatch => ( {
  onTab: tab => {
    dispatch( tabChanged( tab ) )
  }
} );

export default connect( mapStateToProps,
  mapDispatchToProps )( MapToolbar )
