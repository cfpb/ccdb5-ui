import { connect } from 'react-redux'
import { debounce } from './utils'
import React from 'react'
import { screenResized } from './actions/view'

function showMessage() {
  console.log( 'ctrl p / cmd p disabled since we in print mode' )
}

export class WindowSize extends React.Component {
  constructor( props ) {
    super( props )

    // Bindings
    this._keyHandler = this.keydownHandler.bind( this );
  }

  keydownHandler( evt ) {
    if ( evt.keyCode === 80 && ( evt.metaKey || evt.ctrlKey ) &&
      this.props.printMode ) {
      // we're in print mode, disable CMD+P
      evt.preventDefault();
      showMessage();
    }
  }

  // This will initialize the application with the window size
  // and then update redux store
  componentDidMount() {
    this.props.updateWindowSize( window.innerWidth )

    window.addEventListener( 'resize',
      debounce( () => {
        this.props.updateWindowSize( window.innerWidth )
      }, 200 )
    )

    document.addEventListener( 'keydown', this._keyHandler )
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ( {
  printMode: state.view.printMode
} )

export const mapDispatchToProps = dispatch => ( {
  updateWindowSize: size => {
    dispatch( screenResized( size ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( WindowSize )

