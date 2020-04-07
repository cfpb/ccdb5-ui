import { Warning } from '../Warning'
import React from 'react'
import { shallow } from 'enzyme'

describe( 'component:WindowSize', () => {
  it( 'renders Warning without crashing', () => {
    const props = {
      text: 'Some nag message'
    }

    const wrapper = shallow( <Warning { ...props }/> )
    expect( wrapper.find('.m-notification_message')
      .equals(<div className="h4 m-notification_message">Some nag message</div>) )
      .toEqual( true )
    expect( wrapper.find('svg').length ).toEqual( 1 )
  } )

  it( 'renders Warning w/ close button without crashing', () => {
    const props = {
      closeFn: jest.fn(),
      text: 'Some nag message you can close'
    }

    const wrapper = shallow( <Warning { ...props }/> )
    expect( wrapper.find('.m-notification_message')
      .equals(<div className="h4 m-notification_message">Some nag message you can close</div>) )
      .toEqual( true )

    expect( wrapper.find('svg').length ).toEqual( 2 )
    
    const button = wrapper.find( '.close' )
    button.simulate( 'click' )
    expect( props.closeFn ).toHaveBeenCalled()

  } )
} )
