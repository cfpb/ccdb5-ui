import './TabbedNavigation.less'
import { changeTab } from './actions/view'
import { connect } from 'react-redux'
import React from 'react'

export class TabbedNavigation extends React.Component {
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
      <div className="tabbedNavigation">
        <section>
          <button onClick={() => this._setTab( 'Map' )}>
            Map
          </button>
          <button onClick={() => this._setTab( 'Trends' )}>
            Trends
          </button>
          <button onClick={() => this._setTab( 'List' )}>
            List
          </button>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ( {
  tab: state.view.tab
} )

export const mapDispatchToProps = dispatch => ( {
  onTab: tab => {
    dispatch( changeTab( tab ) )
  }
} );

export default connect( mapStateToProps,
  mapDispatchToProps )( TabbedNavigation )
