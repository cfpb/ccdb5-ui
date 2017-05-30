import React from 'react';
import {App} from '../App';
import renderer from 'react-test-renderer';

jest.mock('../UrlBarSynch');
let mockBar = require('../UrlBarSynch').default;
mockBar.prototype.getParams = jest.fn(() => {
  return {
    searchText: 'foo',
    from: 10,
    size: 25
  };
});

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <App />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('_callApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toEqual(
          'https://data.consumerfinance.gov/resource/jhzv-w97w.json'
        );

        var p = new Promise((resolve, reject) => {
          resolve({
            json: function() { 
              return ['123']
            }
          });
        });

        return p;
    });
  });

  it('sets the state when successful', async () => {
    const target = new App();
    target.setState = jest.fn();

    await target._callApi();
    expect(target.setState).toHaveBeenCalledWith({items: ['123'], total: 1});
  });
});

describe('_onSearch', () => {
  var target = null;

  beforeEach(() => {
    target = new App();
    target.setState = jest.fn();
    target.urlBar.setParams = jest.fn();
    target._callApi = jest.fn();
    target._onSearch('*hello*');
  });

  it('updates the state with several new values', () => {
    expect(target.setState).toHaveBeenCalledWith({
      from: 0,
      total: 0,
      searchText: '*hello*'
    });
  });

  it('notifies the Url Bar with all state values', () => {
    expect(target.urlBar.setParams).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 0,
        searchText: '*hello*'
      })
    );
  });

  it('triggers a new API call', () => {
    expect(target._callApi).toHaveBeenCalled();
  });
});

describe('_onPage', () => {
  var target = null;

  beforeEach(() => {
    target = new App();
    target.setState = jest.fn();
    target.urlBar.setParams = jest.fn();
    target._onPage(3);
  });

  it('updates the state with new from value', () => {
    expect(target.setState).toHaveBeenCalledWith({from: 50});
  });

  it('notifies the Url Bar with all state values', () => {
    expect(target.urlBar.setParams).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 50,
        items: [],
        size: 25
      })
    );
  });
});

describe('_onUrlChanged', () => {
  it('updates the state with the url parameters', () => {
    const target = new App();
    target.setState = jest.fn();

    target._onUrlChanged({from: 99});
    expect(target.setState).toHaveBeenCalledWith({from: 99});
  });
});