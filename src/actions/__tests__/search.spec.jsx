import {REQUERY_ALWAYS} from '../../constants'
import * as sut from '../search'

describe('action:search', () => {
    describe('searchFieldChanged', () => {
        it('creates a simple action', () => {
            const searchField = 'qaz'
            const expectedAction = {
                type: sut.SEARCH_FIELD_CHANGED,
                searchField,
                requery: REQUERY_ALWAYS
            }
            expect(sut.searchFieldChanged(searchField)).toEqual(expectedAction)
        })
    })

    describe('searchTextChanged', () => {
        it('creates a simple action', () => {
            const searchText = 'foo'
            const expectedAction = {
                type: sut.SEARCH_TEXT_CHANGED,
                searchText,
                requery: REQUERY_ALWAYS
            }
            expect(sut.searchTextChanged(searchText)).toEqual(expectedAction)
        })
    })
})
