import target, { filterArrayAction, toggleFilter } from '../query'
import * as types from '../../constants'

describe('reducer:query', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
        searchText: '',
        searchField: 'all',
        from: 0,
        size: 10,
        sort: 'relevance_desc'
      })
  })

  it('handles SEARCH_CHANGED actions', () => {
    const action = {
      type: types.SEARCH_CHANGED,
      searchText: 'foo',
      searchType: 'bar',
    }
    const state = {
      from: 80,
      size: 100
    }
    expect(target(state, action)).toEqual({
        searchText: 'foo',
        from: 0,
        size: 100
      })
  })

  it('handles PAGE_CHANGED actions', () => {
    const action = {
      type: types.PAGE_CHANGED,
      page: 2
    }
    const state = {
      size: 100
    }
    expect(target(state, action)).toEqual({
        from: 100,
        size: 100
      })
  })

  it('handles SIZE_CHANGED actions', () => {
    const action = {
      type: types.SIZE_CHANGED,
      size: 50
    }
    const state = {
      size: 100
    }
    expect(target(state, action)).toEqual({
        from: 0,
        size: 50
      })
  })

  it('handles SORT_CHANGED actions', () => {
    const action = {
      type: types.SORT_CHANGED,
      sort: 'foo'
    }
    const state = {
      from: 100,
      size: 100
    }
    expect(target(state, action)).toEqual({
        from: 100,
        sort: 'foo',
        size: 100
      })
  })

  describe('URL_CHANGED actions', () => {
    let action = null
    let state = null
    beforeEach(() => {
      action = {
        type: types.URL_CHANGED,
        params: {}
      }

      state = {
        searchText: '',
        from: 99,
        size: 99
      }
    })

    it('handles empty params', () => {
      expect(target(state, action)).toEqual(state)
    })

    it('converts some parameters to integers', () => {
      // Writing it this way helps with branch coverage
      action.params = { size: '100' }
      expect(target({}, action)).toEqual({ size: 100 })

      action.params = { from: '10' }
      expect(target({}, action)).toEqual({ from: 10 })
    })

    it('converts some parameters to dates', () => {
      const expected = new Date(2013, 1, 3)
      action.params = { min_date: '2013-02-03' }
      expect(target({}, action)).toEqual({ min_date: expected })
    })

    it('ignores incorrect dates', () => {
      action.params = { min_date: 'foo' }
      expect(target({}, action)).toEqual({})
    })

    it('ignores unknown parameters', () => {
      action.params = {
        searchText: 'hello',
        foo: 'bar'
      }

      expect(target(state, action)).toEqual({
        searchText: 'hello',
        from: 99,
        size: 99
      })
    })

    it('handles a single filter', () => {
      action.params = { product: 'Debt Collection' }
      expect(target({}, action)).toEqual({ product: ['Debt Collection'] })
    })

    it('handles a multiple filters', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] }
      expect(target({}, action)).toEqual({ 
        product: ['Debt Collection', 'Mortgage']
      })
    })
  })

  describe('FILTER_CHANGED actions updates query with filter state', () => {
    let key = ''
    let state = null
    let filterName = ''
    let filterValue = null
    let action = null

    beforeEach(() => {
      key = 'affirmative';
      filterName = 'filtyMcFilterson';
      filterValue = { key };
      state = { };
      action = { type: types.FILTER_CHANGED, filterName, filterValue };
    });

    it('handles FILTER_CHANGED actions and returns correct object', () => {
      expect(target(state, action)).toEqual(
        { [filterName]: [key] }
      );
    });

    it('creates a filter array if target is undefined', () => {
      let filterReturn = filterArrayAction(undefined, key);
      expect(filterReturn).toEqual([key]);
    });

    it('adds additional filters when passed', () => {
      let filterReturn = filterArrayAction([key], 'bye');
      expect(filterReturn).toEqual([key, 'bye']);
    });

    it('removes filters when already present', () => {
      let filterReturn = filterArrayAction([key, 'bye'], key);
      expect(filterReturn).toEqual(['bye']);
    });

  });

  describe('FILTER_REMOVED actions', () => {
    let action;
    beforeEach(() => {
      action = {
        type: types.FILTER_REMOVED,
        filterName: 'foo',
        filterValue: 'baz'
      }      
    })

    it('removes a filter when one exists', () => {
      const state = {
        foo: ['bar', 'baz', 'qaz']
      }
      expect(target(state, action)).toEqual({
        foo: ['bar', 'qaz']
      })
    })    

    it('handles a missing filter', () => {
      const state = {
        foobar: ['bar', 'baz', 'qaz']
      }
      expect(target(state, action)).toEqual({
        foobar: ['bar', 'baz', 'qaz']
      })
    })    

    it('handles a missing filter value', () => {
      const state = {
        foo: ['bar', 'qaz']
      }
      expect(target(state, action)).toEqual({
        foo: ['bar', 'qaz']
      })
    })    
  })

  it('handles FILTER_ALL_REMOVED actions', () => {
    const action = {
      type: types.FILTER_ALL_REMOVED
    }
    const state = {
      from: 100,
      size: 100,
      timely: ['bar', 'baz', 'qaz'],
      company: ['Acme']
    }
    expect(target(state, action)).toEqual({
      from: 100,
      size: 100
    })
  })

  describe('handles FILTER_MULTIPLE_ADDED actions', () => {
    let action;
    beforeEach(() => {
      action = {
        type: types.FILTER_MULTIPLE_ADDED,
        filterName: 'issue',
        values: ['Mo Money', 'Mo Problems']
      }
    })

    it("adds all filters if they didn't exist", () => {
      expect(target({}, action)).toEqual({
        issue: ['Mo Money', 'Mo Problems']
      })
    })

    it("skips filters if they exist already", () => {
      const state = {
        issue: ['foo']
      }
      action.values.push('foo')

      expect(target(state, action)).toEqual({
        issue: ['foo', 'Mo Money', 'Mo Problems']
      })
    })
  })

  describe('handles FILTER_MULTIPLE_REMOVED actions', () => {
    let action;
    beforeEach(() => {
      action = {
        type: types.FILTER_MULTIPLE_REMOVED,
        filterName: 'issue',
        values: ['Mo Money', 'Mo Problems', 'bar']
      }
    })

    it("removes filters if they exist", () => {
      const state = {
        issue: ['foo', 'Mo Money', 'Mo Problems']
      }
      expect(target(state, action)).toEqual({
        issue: ['foo']
      })
    })

    it("ignores unknown filters", () => {
      expect(target({}, action)).toEqual({})
    })
  })
})
