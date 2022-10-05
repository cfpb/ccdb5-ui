import { ComplaintDetail } from '../ComplaintDetail';
import React from 'react';
import { shallow } from 'enzyme';

/**
 * Sets up enzyme.
 */
function setupEnzyme() {
  const props = {
    complaint_id: '123456789',
    loadDetail: jest.fn(),
  };

  const target = shallow(<ComplaintDetail {...props} />);

  return {
    props,
    target,
  };
}

describe('component::ComplaintDetail', () => {
  describe('navigation', () => {
    it('takes the user back to the previous page', () => {
      global.history.go = jest.fn();

      const { target } = setupEnzyme();
      const back = target.find('.back-to-search button');
      back.simulate('click');
      expect(global.history.go).toHaveBeenCalledWith(-1);
    });

    it('takes the user back to the home page', () => {
      const orig = document.referrer;
      Object.defineProperty(document, 'referrer', { value: '' });
      const { target } = setupEnzyme();
      Object.defineProperty(document, 'referrer', { value: orig });

      const back = target.find('.back-to-search button');
      back.simulate('click');
      expect(document.URL).toEqual('http://localhost/');
    });
  });
});
