import { mapDispatchToProps, WindowSize } from '../WindowSize'
import React from 'react'
import { mount, shallow } from 'enzyme'

// tell jest to mock all timeout functions
jest.useFakeTimers()

function setupEnzyme() {
  const props = {
    updateWindowSize: jest.fn()
  }

  const target = shallow( <WindowSize { ...props } /> )

  return {
    props,
    target
  }
}


describe( 'component:WindowSize', () => {
  describe( 'componentDidMount', () => {
    it( 'initializes the window size', () => {
      const { target, props } = setupEnzyme()
      expect( props.updateWindowSize ).toHaveBeenCalledTimes( 1 )
    } )


    it( 'updates when window is resized', () => {
      const props = {
        updateWindowSize: jest.fn()
      }
      let target = new WindowSize( props )

      // Change the viewport to 500px.
      global.innerWidth = 500
      //
      // // Trigger the window resize event.
      // global.dispatchEvent(new Event('resize'));
      // set spy to 'resize' listener
      global.addEventListener( 'resize', props.updateWindowSize )
      global.dispatchEvent( new Event( 'resize' ) )

      // Change the viewport to 500px.
      global.innerWidth = 1000
      global.dispatchEvent( new Event( 'resize' ) )

      jest.advanceTimersByTime( 200 )
      expect( props.updateWindowSize ).toHaveBeenCalledTimes( 2 )


    } )

  } )
  describe( 'mapDispatchToProps', () => {
    it( 'hooks into updateWindowSize', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).updateWindowSize( {} )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
  } )
} )
