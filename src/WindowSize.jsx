import { connect } from 'react-redux'
import { debounce } from './utils'
import React from 'react'
import { screenResized } from './actions/view'

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

  render() {
    return null
  }
}

export const mapDispatchToProps = dispatch => ( {
  updateWindowSize: size => {
    dispatch( screenResized( size ) )
  }
} )

export default connect( null, mapDispatchToProps )( WindowSize )

