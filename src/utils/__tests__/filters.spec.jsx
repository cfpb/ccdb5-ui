import * as sut from '../filters'
import { slugify } from '../../utils'

// ----------------------------------------------------------------------------
// Tests
describe( 'getUpdatedFilters', () => {
  it( 'skips filters not in filterPatch list', () => {
    const aggs = []
    const filterName = 'TX'
    const filters = [ 'a', 'b', 'c' ]
    const fieldName = 'foo'
    const res = sut.getUpdatedFilters( filterName, filters, aggs, fieldName )
    expect( res ).toEqual( [ 'a', 'b', 'c' ] )
  } )

  it( 'removes parent and adds sibling filters', () => {
    const aggs = [
      {
        key: 'a',
        'sub_issue.raw': {
          buckets: [ { key: 'b' }, { key: 'c' } ]
        }
      } ]
    const filterName = slugify( 'a', 'b' )
    const filters = [ 'a', 'b', 'c' ]
    const fieldName = 'issue'
    const res = sut.getUpdatedFilters( filterName, filters, aggs, fieldName )
    expect( res ).toEqual( [ 'b', 'c', slugify( 'a', 'c' ) ] )
  } )

  it( 'handles parent with no child', () => {
    const aggs = [
      {
        key: 'a',
        'sub_issue.raw': {
          buckets: []
        }
      } ]
    const filterName = 'a'
    const filters = [ 'a', 'b', 'c' ]
    const fieldName = 'issue'
    const res = sut.getUpdatedFilters( filterName, filters, aggs, fieldName )
    expect( res ).toEqual( [ 'b', 'c' ] )
  } )
} )
