import React from 'react'
import { mount } from 'enzyme';
import Selector from '../Selector'

function setupEnzyme() {
  const props = {
    options: ['foo', 'bar', 'baz'],
    onOptionSelected: jest.fn(),
    renderOption: x => {
      return {
        value: x,
        component: x
      }
    }
  }

  const target = mount(<Selector {...props} />);

  return {
    props,
    target
  }
}

describe('component::Selector', () => {
  it('notifies the parent when an option is clicked', () => {
    const {target, props} = setupEnzyme()
    const option1 = target.find('li').at(1)
    option1.simulate('mouseDown')
    expect(props.onOptionSelected).toHaveBeenCalledWith(1)
  })
})

