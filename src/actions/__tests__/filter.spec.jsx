jest.mock('../complaints');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import filter, { filterChanged } from '../search'
import * as types from '../../constants'

describe('action:filter', () => {
  it('returns true', () => {
    const val = true;
    
    expect(val).toEqual(true);
  });
})
