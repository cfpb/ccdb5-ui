import { mapDispatchToProps, ResultsPanel } from '../ResultsPanel';
import React from 'react';
import { shallow } from 'enzyme';

describe('component:Results', () => {
  let target;
  const actionMock = jest.fn();

  describe('event listeners', () => {
    beforeEach(() => {
      window.addEventListener = jest.fn();
      window.removeEventListener = jest.fn();
    });

    it('unregisters the same listener on unmount', () => {
      const a = window.addEventListener;
      const b = window.removeEventListener;

      target = shallow(<ResultsPanel tab="foo" />);
      expect(a.mock.calls.length).toBe(2);
      expect(a.mock.calls[0][0]).toBe('afterprint');
      expect(a.mock.calls[1][0]).toBe('beforeprint');

      target.unmount();
      expect(b.mock.calls.length).toBe(2);
      expect(b.mock.calls[0][0]).toBe('afterprint');
      expect(b.mock.calls[1][0]).toBe('beforeprint');

      expect(a.mock.calls[0][1]).toBe(b.mock.calls[0][1]);
    });
  });

  describe('print mode', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('toggles print mode on', () => {
      target = shallow(
        <ResultsPanel togglePrintModeOn={actionMock} tab="Foobar" />
      );
      const instance = target.instance();
      instance._togglePrintStylesOn();
      expect(actionMock).toHaveBeenCalledTimes(1);
    });

    it('toggles print mode off', () => {
      target = shallow(
        <ResultsPanel togglePrintModeOff={actionMock} tab="Foobar" />
      );
      const instance = target.instance();
      instance._togglePrintStylesOff();
      expect(actionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapDispatchToProps', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('provides a way to call togglePrintModeOn', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).togglePrintModeOn();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
    it('provides a way to call togglePrintModeOff', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).togglePrintModeOff();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });
});
