import target, {
  defaultQuery, filterArrayAction, toggleFilter
} from '../query'
import * as types from '../../constants'

describe('reducer:query', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
        searchText: '',
        searchField: 'all',
        from: 0,
        queryString: '?field=all&size=25&sort=created_date_desc',
        size: 25,
        sort: 'created_date_desc'
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
        queryString: '?search_term=foo&size=100',
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
        queryString: '?frm=100&size=100',
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
        queryString: '?size=50',
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
        queryString: '?frm=100&size=100&sort=foo',
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

      state = { ...defaultQuery }
    })

    it('handles empty params', () => {
      expect(target(state, action)).toEqual(state)
    })

    it('handles string params', () => {
      action.params = { searchText: 'hello' }
      const actual = target(state, action)
      expect(actual.searchText).toEqual('hello')
    })

    it('converts some parameters to integers', () => {
      action.params = { size: '100' }
      const actual = target(state, action)
      expect(actual.size).toEqual(100)
    })

    it('ignores bad integer parameters', () => {
      action.params = { size: 'foo' }
      const actual = target(state, action)
      expect(actual.size).toEqual(25)
    })

    it('converts some parameters to dates', () => {
      const expected = new Date(2013, 1, 3)
      action.params = { date_received_min: '2013-02-03' }
      const actual = target({}, action).date_received_min
      expect(actual.getFullYear()).toEqual(expected.getFullYear())
      expect(actual.getMonth()).toEqual(expected.getMonth())
    })

    it('converts flag parameters to strings', () => {
      const expected = 'true'
      action.params = { has_narrative: true }
      const actual = target({}, action).has_narrative
      expect(actual).toEqual(expected)
    })

    it('ignores incorrect dates', () => {
      action.params = { date_received_min: 'foo' }
      expect(target({}, action)).toEqual(state)
    })

    it('ignores unknown parameters', () => {
      action.params = { foo: 'bar' }
      expect(target(state, action)).toEqual(state)
    })

    it('handles a single filter', () => {
      action.params = { product: 'Debt Collection' }
      const actual = target({}, action)
      expect( actual.product ).toEqual( ['Debt Collection'] )
    })

    it('handles a multiple filters', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] }
      const actual = target({}, action)
      expect( actual.product ).toEqual( ['Debt Collection', 'Mortgage'] )
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
        {
          [filterName]: [key],
          queryString: '?filtyMcFilterson=affirmative'
        }
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
        foo: ['bar', 'qaz'],
        queryString: '?foo=bar&foo=qaz'
      })
    })    

    it('handles a missing filter', () => {
      const state = {
        foobar: ['bar', 'baz', 'qaz']
      }
      expect(target(state, action)).toEqual({
        foobar: ['bar', 'baz', 'qaz'],
        queryString: '?foobar=bar&foobar=baz&foobar=qaz'
      })
    })    

    it('handles a missing filter value', () => {
      const state = {
        foo: ['bar', 'qaz']
      }
      expect(target(state, action)).toEqual({
        foo: ['bar', 'qaz'],
        queryString: '?foo=bar&foo=qaz'
      })
    })    
  })

  describe('FILTER_ALL_REMOVED actions', () => {
    let action, state;
    beforeEach(() => {
      action = {
        type: types.FILTER_ALL_REMOVED
      }

      state = {
        company: ['Acme'],
        date_received_min: new Date(2012, 0, 1),
        from: 100,
        has_narrative: true,
        searchField: 'all',
        size: 100,
        timely: ['bar', 'baz', 'qaz'],
      }
    })

    it('clears all filters', () => {
      expect(target(state, action)).toEqual({
        from: 100,
        queryString: '?field=all&frm=100&size=100',
        searchField: 'all',
        size: 100
      })
    })

    describe('when searching Narratives', () => {
      it('does not clear the hasNarrative filter', () => {
        const qs = '?field=' + types.NARRATIVE_SEARCH_FIELD +
          '&frm=100&has_narrative=true&size=100'

        state.searchField = types.NARRATIVE_SEARCH_FIELD
        expect(target(state, action)).toEqual({
          from: 100,
          has_narrative: true,
          queryString: qs,
          searchField: types.NARRATIVE_SEARCH_FIELD,
          size: 100
        })
      })
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
        issue: ['Mo Money', 'Mo Problems'],
        queryString: '?issue=Mo%20Money&issue=Mo%20Problems'
      })
    })

    it("skips filters if they exist already", () => {
      const state = {
        issue: ['foo']
      }
      action.values.push('foo')

      expect(target(state, action)).toEqual({
        issue: ['foo', 'Mo Money', 'Mo Problems'],
        queryString: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems'
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
        issue: ['foo'],
        queryString: '?issue=foo'
      })
    })

    it("ignores unknown filters", () => {
      expect(target({}, action)).toEqual({
        queryString: ''
      })
    })
  })

  describe('handles DATE_RANGE_CHANGED actions', () => {
    let action;
    beforeEach(() => {
      action = {
        type: types.DATE_RANGE_CHANGED,
        filterName: 'date_received',
        minDate: new Date(2001, 0, 30),
        maxDate: new Date(2013, 1, 3)
      }
    })

    it("adds the dates", () => {
      expect(target({}, action)).toEqual({
        date_received_min: new Date(2001, 0, 30),
        date_received_max: new Date(2013, 1, 3),
        queryString:'?date_received_max=2013-02-03&date_received_min=2001-01-30'
      })
    })

    it("does not add empty dates", () => {
      action.minDate = null
      expect(target({}, action)).toEqual({
        date_received_max: new Date(2013, 1, 3),
        queryString: '?date_received_max=2013-02-03'
      })
    })
  })

  describe('handles FILTER_FLAG_CHANGED actions', () => {
    let action;
    beforeEach(() => {
      action = {
        type: types.FILTER_FLAG_CHANGED,
        filterName: 'has_narrative',
        filterValue: true
      }
    })

    it("adds narrative filter when present", () => {
      expect(target({}, action)).toEqual({
        has_narrative: true,
        queryString: '?has_narrative=true'
      })
    })

    it("does not add when narrative filter is false", () => {
      action.filterValue = false
      expect(target({}, action)).toEqual({
        queryString: ''
      })
    })
  })
})
