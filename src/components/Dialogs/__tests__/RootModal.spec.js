import { shallow } from 'enzyme';
import React from 'react';
import * as types from '../../../constants';
import { RootModal, mapDispatchToProps } from '../RootModal';

// import { shallow } from 'enzyme';

/**
 *
 */
function setupEnzyme() {
  const props = {
    modalType: types.MODAL_TYPE_DATA_EXPORT,
    modalProps: {},
    onClose: jest.fn(),
  };

  const target = shallow(<RootModal {...props} />);

  return {
    props,
    target,
  };
}

describe('component::RootModal', () => {
  it('only renders registered dialogs', () => {
    const { target } = setupEnzyme();
    expect(target.getElements()[0].type).not.toEqual('span');
    expect(target.getElements()[0].type).toBeInstanceOf(Function);
  });

  describe('mapDispatchToProps', () => {
    it('hooks into onClose', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onClose();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });
});
