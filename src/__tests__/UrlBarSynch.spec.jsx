import React from 'react';
import { UrlBarSynch, mapDispatchToProps } from '../UrlBarSynch';
import * as types from '../constants'

describe('component:UrlBarSynch', () =>{
  let target;
  let props;
  beforeEach(() => {
    props = {
      params: {
        searchText: '',
        from: 0,
        size: 10,
        date_received_min: new Date(2013, 1, 3),
        has_narrative: true
      },
      onUrlChanged: jest.fn()
    }

   target = new UrlBarSynch(props);
   target.history.push = jest.fn()
  });

  describe('componentWillReceiveProps', () => {
    it('pushes a change to the url bar when parameters change', () => {
      props.params.from = 99
      const expected = '?date_received_min=2013-02-03&from=99&has_narrative=true&searchText=&size=10'

      target.componentWillReceiveProps(props)

      expect(target.currentQS).toEqual(expected)
      expect(target.history.push).toHaveBeenCalledWith({ search: expected })
    })

    it('does not push history when parameters are the same', () => {
      target.currentQS = '?date_received_min=2013-02-03&from=0&has_narrative=true&searchText=&size=10'
      target.componentWillReceiveProps(props)
      expect(target.history.push).not.toHaveBeenCalled()
    })
  })

  describe('_onUrlChanged', () => {
    it('does nothing when the action is not "POP"', () => {
      target._onUrlChanged({search: '?foo=bar'}, 'PUSH');
      expect(props.onUrlChanged).not.toHaveBeenCalled();
    });

    it('calls the provided callback when the POP action happens', () => {
      target._onUrlChanged({search: '?foo=bar'}, 'POP');
      expect(target.currentQS).toEqual('?foo=bar')
      expect(props.onUrlChanged).toHaveBeenCalledWith({search: '?foo=bar'});
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into announceUrlChanged', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onUrlChanged({});
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })
})
