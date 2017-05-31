import React from 'react';
import UrlBarSynch from '../UrlBarSynch';

describe('getParams', () => {
  it('returns a dictionary of parameters from the current URL', () => {
    const target = new UrlBarSynch();
    target._extractQueryStringParams = jest.fn(() => 'foo');

    const actual = target.getParams();
    expect(target._extractQueryStringParams).toHaveBeenCalled();
    expect(actual).toEqual('foo');
  });
});

describe('setParams', () => {
  var target = null;
  var pushed = null;

  beforeEach(() => {
    target = new UrlBarSynch();
    target.history.push = jest.fn((x) => pushed = x.search);
  });

  it('handles an empty set', () => {
    target.setParams({});
    expect(pushed).toEqual('?');
  });

  it('only handles known params', () => {
    target.setParams({foo: 'bar', from: 10});
    expect(pushed).toEqual('?from=10');
  });
});

describe('_extractQueryStringParams', () => {
  var target = null;

  beforeEach(() => {
    target = new UrlBarSynch();
  });

  it('handles an empty query string', () => {
    var actual = target._extractQueryStringParams('');
    expect(actual.from).toEqual(0);
    expect(actual.size).toEqual(10);
    expect(actual.searchText).toEqual('foo');
  });

  it('returns integers for some params', () => {
    var actual = target._extractQueryStringParams('?from=20&size=50');
    expect(actual.from).toEqual(20);
    expect(actual.size).toEqual(50);
  });

  it('returns defaults for out-of-range params', () => {
    var actual = target._extractQueryStringParams('?from=foo&size=bar');
    expect(actual.from).toEqual(0);
    expect(actual.size).toEqual(10);
  });
});

describe('_onUrlChanged', () => {
  var target = null;

  it('does nothing when no callback has been provided', () => {
    target = new UrlBarSynch();
    target._extractQueryStringParams = jest.fn((s) => s);
    target._onUrlChanged({search: 'bar'}, 'POP');
    expect(target._extractQueryStringParams).not.toHaveBeenCalled();
  });

  it('does nothing when the action is not "POP"', () => {
    target = new UrlBarSynch(console.log);
    target._extractQueryStringParams = jest.fn((s) => s);
    target._onUrlChanged({search: 'bar'}, 'PUSH');
    expect(target._extractQueryStringParams).not.toHaveBeenCalled();
  });

  it('calls the provided callback when the POP action happens', () => {
    var cb = (o) => { expect(o).toEqual('bar'); }
    target = new UrlBarSynch(cb);
    target._extractQueryStringParams = jest.fn((s) => s);
    target._onUrlChanged({search: 'bar'}, 'POP');
  });  
});