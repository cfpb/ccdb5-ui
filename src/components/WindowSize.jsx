import { connect } from 'react-redux'
import { debounce } from '../utils'
import React from 'react'
import { screenResized } from '../actions/view'

export class WindowSize extends React.Component {
  // This will initialize the application with the window size
  // and then update redux store
  componentDidMount() {
    this.props.updateWindowSize( window.innerWidth )

    window.addEventListener( 'resize',
      debounce( () => {
        this.props.updateWindowSize( window.innerWidth )
      }, 200 )
    )
  }

  componentDidUpdate() {
    if ( this.props.printMode && this.props.fromExternal ) {
      setTimeout( function() {
        window.print()
      }, 3000 )
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ( {
  fromExternal: state.view.fromExternal,
  printMode: state.view.printMode
} )

export const mapDispatchToProps = dispatch => ( {
  updateWindowSize: size => {
    dispatch( screenResized( size ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( WindowSize )

