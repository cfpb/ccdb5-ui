import './TabbedNavigation.less'
import { connect } from 'react-redux'
import React from 'react'
import { tabChanged } from './actions/view'

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

  _getTabClass( tab ) {
    const tabName = tab.toLowerCase() + ' tab'
    return this.props.tab === tab ? tabName + ' active' : tabName
  }

  render() {
    return (
      <div className="tabbed-navigation">
        <section>
          <button
            className={ this._getTabClass( 'Map' ) }
            onClick={() => this._setTab( 'Map' )}>
            Map
          </button>

          <button className={ this._getTabClass( 'List' ) }
                  onClick={() => this._setTab( 'List' )}>
            List
          </button>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ( {
  tab: state.query.tab
} )

export const mapDispatchToProps = dispatch => ( {
  onTab: tab => {
    dispatch( tabChanged( tab ) )
  }
} );

export default connect( mapStateToProps,
  mapDispatchToProps )( TabbedNavigation )
