import target, {
  dataNormalizationUpdated,
  filterAdded,
  filterArrayAction,
  filterRemoved,
  filterToggled,
  filtersCleared,
  filtersReplaced,
  filtersState,
  mapWarningDismissed,
  multipleFiltersAdded,
  multipleFiltersRemoved,
  stateFilterAdded,
  stateFilterCleared,
  stateFilterRemoved,
  toggleFlagFilter,
} from './filtersSlice';
import * as types from '../../constants';

describe('Filters', () => {
  describe('FILTER_CHANGED actions updates query with filter state', () => {
    let key = '';
    let state = null;
    let filterName = '';
    let filterValue = null;

    beforeEach(() => {
      key = 'affirmative';
      filterName = 'issue';
      filterValue = { key };
      state = filtersState;
    });

    it('handles FILTER_CHANGED actions and returns correct object', () => {
      expect(target(state, filterToggled(filterName, filterValue))).toEqual({
        ...state,
        [filterName]: [key],
      });
    });

    it('creates a filter array if target is undefined', () => {
      const filterReturn = filterArrayAction(undefined, key);
      expect(filterReturn).toEqual([key]);
    });

    it('adds additional filters when passed', () => {
      const filterReturn = filterArrayAction([key], 'bye');
      expect(filterReturn).toEqual([key, 'bye']);
    });

    it('removes filters when already present', () => {
      const filterReturn = filterArrayAction([key, 'bye'], key);
      expect(filterReturn).toEqual(['bye']);
    });
  });

  describe('FILTER_ADDED actions', () => {
    let filterName, filterValue, state;
    beforeEach(() => {
      filterName = 'product';
      filterValue = 'baz';
    });

    it('adds a filter when one exists', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz', 'baz'],
      });
    });

    it('ignores a filter when it exists', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz', 'baz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz', 'baz'],
      });
    });

    it('handles a missing filter', () => {
      state = {
        ...filtersState,
        issue: ['bar', 'baz', 'qaz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['baz'],
        issue: ['bar', 'baz', 'qaz'],
      });
    });

    it('handles a missing filter value', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz', 'baz'],
      });
    });

    describe('has_narrative', () => {
      it('handles when present', () => {
        filterName = 'has_narrative';
        state = {
          ...filtersState,
          has_narrative: true,
        };
        expect(target(state, filterAdded(filterName, filterValue))).toEqual({
          ...state,
          has_narrative: true,
        });
      });

      it('handles when absent', () => {
        filterName = 'has_narrative';
        expect(
          target(filtersState, filterAdded(filterName, filterValue)),
        ).toEqual({
          ...filtersState,
          has_narrative: true,
        });
      });
    });
  });

  describe('FILTER_REMOVED actions', () => {
    let filterName, filterValue, state;
    beforeEach(() => {
      filterName = 'product';
      filterValue = 'baz';
    });

    it('removes a filter when one exists', () => {
      state = {
        ...filtersState,
        product: ['bar', 'baz', 'qaz'],
      };
      expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz'],
      });
    });

    it('handles a missing filter', () => {
      state = {
        ...filtersState,
        issue: ['bar', 'baz', 'qaz'],
      };
      expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
        ...state,
        issue: ['bar', 'baz', 'qaz'],
      });
    });

    it('handles a missing filter value', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz'],
      });
    });

    describe('has_narrative', () => {
      it('handles when present', () => {
        filterName = 'has_narrative';
        state = {
          ...filtersState,
          has_narrative: true,
        };
        const newState = { ...state };
        delete newState.has_narrative;
        expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
          ...newState,
        });
      });

      it('handles when present - Map', () => {
        filterName = 'has_narrative';
        state = {
          ...filtersState,
          dataNormalization: 'None',
          has_narrative: true,
        };
        const newState = { ...state };
        delete newState.has_narrative;
        expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
          ...newState,
        });
      });

      it('handles when absent', () => {
        filterName = 'has_narrative';
        expect(
          target(filtersState, filterRemoved(filterName, filterValue)),
        ).toEqual({
          ...filtersState,
        });
      });
    });
  });

  describe('FILTER_ALL_REMOVED actions', () => {
    let action, state;
    beforeEach(() => {
      state = {
        ...filtersState,
        company: ['Acme'],
        has_narrative: true,
        timely: ['bar', 'baz', 'qaz'],
      };
    });

    it('clears all filters in Narratives Search mode', () => {
      const actual = target(
        state,
        filtersCleared(types.NARRATIVE_SEARCH_FIELD),
      );
      delete state.company;
      delete state.timely;
      expect(actual).toMatchObject({
        ...state,
      });
    });

    // TODO: we need to move this logic to the component level or another action
    // searchField lives in the query reducer and should not have this logic
    describe.skip('when searching Narratives', () => {
      it('does not clear the hasNarrative filter', () => {
        state.searchField = types.NARRATIVE_SEARCH_FIELD;
        delete state.company;
        delete state.timely;
        const actual = target(state, filtersCleared(action));
        expect(actual).toMatchObject({
          ...state,
          has_narrative: true,
          searchField: types.NARRATIVE_SEARCH_FIELD,
        });
      });
    });
  });

  describe('FILTER_MULTIPLE_ADDED actions', () => {
    let filterName, values, state;
    beforeEach(() => {
      filterName = 'issue';
      values = ['Mo Money', 'Mo Problems'];
    });

    it("adds all filters if they didn't exist", () => {
      expect(
        target(filtersState, multipleFiltersAdded(filterName, values)),
      ).toEqual({
        ...filtersState,
        issue: ['Mo Money', 'Mo Problems'],
      });
    });

    it('skips filters if they exist already', () => {
      state = {
        ...filtersState,
        issue: ['foo'],
      };
      values.push('foo');

      expect(target(state, multipleFiltersAdded(filterName, values))).toEqual({
        ...state,
        issue: ['foo', 'Mo Money', 'Mo Problems'],
      });
    });
  });

  describe('FILTER_MULTIPLE_REMOVED actions', () => {
    let filterName, values, state;
    beforeEach(() => {
      filterName = 'issue';
      values = ['Mo Money', 'Mo Problems', 'bar'];
    });

    it('removes filters if they exist', () => {
      state = {
        ...filtersState,
        focus: 'Mo Money',
        issue: ['foo', 'Mo Money', 'Mo Problems'],
      };
      expect(target(state, multipleFiltersRemoved(filterName, values))).toEqual(
        {
          ...state,
          issue: ['foo'],
        },
      );
    });

    it('ignores unknown filters', () => {
      expect(
        target(filtersState, multipleFiltersRemoved(filterName, values)),
      ).toEqual({
        ...filtersState,
      });
    });
  });

  describe('FILTER_FLAG_CHANGED actions', () => {
    let filterName;
    beforeEach(() => {
      filterName = 'has_narrative';
    });

    it('adds narrative filter to empty state', () => {
      expect(target(filtersState, toggleFlagFilter(filterName))).toEqual({
        ...filtersState,
        has_narrative: true,
      });
    });

    it('toggles off narrative filter', () => {
      expect(
        target(
          { ...filtersState, has_narrative: true },
          toggleFlagFilter(filterName),
        ),
      ).toEqual({
        ...filtersState,
      });
    });
  });

  describe('FILTER_REPLACED actions', () => {
    let state;
    it('replaces existing filter set', () => {
      const filterName = 'foobar';
      const values = [3, 4, 5];
      state = {
        ...filtersState,
        foobar: [1, 23, 2],
      };
      expect(target(state, filtersReplaced(filterName, values))).toEqual({
        ...state,
        foobar: [3, 4, 5],
      });
    });
  });

  describe('FOCUS_CHANGED actions', () => {});

  describe('STATE_FILTERS', () => {
    let action, result;
    describe('STATE_FILTER_ADDED', () => {
      beforeEach(() => {
        action = { abbr: 'IL', name: 'Illinois' };
      });
      it('adds state filter', () => {
        result = target({ ...filtersState }, stateFilterAdded(action));
        expect(result).toEqual({
          ...filtersState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          state: ['IL'],
        });
      });
      it('does not add dupe state filter', () => {
        result = target(
          {
            ...filtersState,
            state: ['IL', 'TX'],
          },
          stateFilterAdded(action),
        );

        expect(result).toEqual({
          ...filtersState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          state: ['IL', 'TX'],
        });
      });
    });

    describe('STATE_FILTER_CLEARED', () => {
      it('removes state filters', () => {
        result = target(
          {
            ...filtersState,
            state: ['FO', 'BA'],
          },
          stateFilterCleared(),
        );

        expect(result).toEqual({
          ...filtersState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
        });
      });
    });

    describe('STATE_FILTER_REMOVED', () => {
      beforeEach(() => {
        action = { abbr: 'IL', name: 'Illinois' };
      });
      it('removes a state filter', () => {
        result = target(
          {
            ...filtersState,
            state: ['CA', 'IL'],
          },
          stateFilterRemoved(action),
        );
        expect(result).toEqual({
          ...filtersState,
          state: ['CA'],
        });
      });
      it('handles empty state', () => {
        result = target({ ...filtersState }, stateFilterRemoved(action));
        expect(result).toEqual({
          ...filtersState,
        });
      });
    });
  });

  describe('Map', () => {
    let action, state;
    describe('Data normalization', () => {
      beforeEach(() => {
        action = 'FooBar';
        state = {
          ...filtersState,
        };
      });
      it('handles default value', () => {
        expect(target(state, dataNormalizationUpdated(action))).toEqual({
          ...state,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
        });
      });

      it('handles per 1000 value', () => {
        action = types.GEO_NORM_PER1000;
        expect(target(state, dataNormalizationUpdated(action))).toEqual({
          ...state,
          dataNormalization: 'Per 1000 pop.',
          enablePer1000: true,
          mapWarningEnabled: true,
        });
      });
    });

    describe('Map Warning', () => {
      it('handles mapWarningDismissed action', () => {
        state = {
          ...filtersState,
          company: [1, 2, 3],
          product: 'bar',
          mapWarningEnabled: true,
        };
        expect(target(state, mapWarningDismissed())).toEqual({
          ...state,
          company: [1, 2, 3],
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          product: 'bar',
          mapWarningEnabled: false,
        });
      });
    });
  });
});
