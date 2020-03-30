import { connect } from 'react-redux'
import { debounce } from './utils'
import React from 'react'
import { screenResized } from './actions/view'


export class WindowSize extends React.Component {
  // This will initialize the application with the params in the URL
  // and then call the API
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

export const mapStateToProps = state => ( {
  showFilters: state.view.showFilters
} )

export const mapDispatchToProps = dispatch => ( {
  updateWindowSize: size => {
    dispatch( screenResized( size ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( WindowSize )

