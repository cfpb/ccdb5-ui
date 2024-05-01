import { Warning } from '../Warnings/Warning';
import React from 'react';
import { shallow } from 'enzyme';

describe('component:WindowSize', () => {
  it('renders Warning without crashing', () => {
    const props = {
      text: 'Some nag message',
    };

    const wrapper = shallow(<Warning {...props} />);
    expect(
      wrapper
        .find('.m-notification__message')
        .equals(
          <div className="m-notification__message">Some nag message</div>,
        ),
    ).toEqual(true);
  });

  it('renders Warning w/ close button without crashing', () => {
    const props = {
      closeFn: jest.fn(),
      text: 'Some nag message you can close',
    };

    const wrapper = shallow(<Warning {...props} />);
    expect(
      wrapper
        .find('.m-notification__message')
        .equals(
          <div className="m-notification__message">
            Some nag message you can close
          </div>,
        ),
    ).toEqual(true);

    const button = wrapper.find('.close');
    button.simulate('click');
    expect(props.closeFn).toHaveBeenCalled();
  });
});
