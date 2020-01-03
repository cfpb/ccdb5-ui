// reducer for the Map Tab
import { API_CALLED, TILE_MAP_STATES } from '../constants'
import { COMPLAINTS_FAILED, COMPLAINTS_RECEIVED } from '../actions/complaints'

export const defaultState = {
  issue: [],
  product: [],
  state: []
}

export const processAggregations = agg => {
  const total = agg.doc_count
  const chartResults = []
  for ( const k in agg ) {
    if ( agg[k].buckets ) {
      agg[k].buckets.forEach( o => {
        chartResults.push( {
          name: o.key,
          value: o.doc_count,
          pctChange: 1,
          isParent: true,
          hasChildren: false,
          pctOfSet: Math.round( o.doc_count / total * 100 )
            .toFixed( 2 ),
          width: 0.5
        } )
      } )
    }
  }
  return chartResults
}

export const processLineChart = inputData => {
  // tbd fill this in from actual data somewhere
  if ( inputData ) {
    return {
      dataRange: [
        {
          count: 2,
          max: 2487,
          sum: 4964,
          avg: 2482,
          min: 2477,
          date: '2017-01-01T00:00:00.000Z'
        },
        {
          count: 2,
          max: 2263,
          sum: 4300,
          avg: 2150,
          min: 2037,
          date: '2018-01-01T00:00:00.000Z'
        }
      ],
      dataByTopic: [
        {
          topicName: 'BANK OF AMERICA, NATIONAL ASSOCIATION',
          topic: 'BANK OF AMERICA, NATIONAL ASSOCIATION',
          show: true,
          readOnly: true,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 738
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 602
            }
          ]
        },
        {
          topicName: 'Average of comparison set',
          topic: 'Average of comparison set',
          dashed: true,
          show: true,
          readOnly: true,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 2482
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 2150
            }
          ]
        },
        {
          topicName: 'Sum of comparable companies',
          topic: 'Sum of comparable companies',
          show: true,
          readOnly: true,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 4964
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 4300
            }
          ]
        },
        {
          topicName: 'Experian Information Solutions Inc.',
          topic: 'Experian Information Solutions Inc.',
          recommended: '',
          show: false,
          readOnly: false,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 2487
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 2263
            }
          ]
        },
        {
          topicName: 'TRANSUNION INTERMEDIATE HOLDINGS, INC.',
          topic: 'TRANSUNION INTERMEDIATE HOLDINGS, INC.',
          recommended: '',
          show: false,
          readOnly: false,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 2477
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 2037
            }
          ]
        }
      ]
    }
  }

  return []
}

export const processStateAggregations = agg => {
  const states = Object.values( agg.state.buckets )
    .filter( o => TILE_MAP_STATES.includes( o.key ) )
    .map( o => ( {
      name: o.key,
      value: o.doc_count,
      issue: 'Being broke',
      product: 'Some Product Name'
    } ) );

  const stateNames = states.map( o => o.name );

  // patch any missing data
  if ( stateNames.length > 0 ) {
    TILE_MAP_STATES.forEach( o => {
      if ( !stateNames.includes( o ) ) {
        states.push( { name: o, value: 0, issue: '', product: '' } );
      }
    } );
  }
  return states
}

export default ( state = defaultState, action ) => {
  switch ( action.type ) {
    case API_CALLED:
      return {
        ...state,
        activeCall: action.url,
        isLoading: true
      }

    case COMPLAINTS_RECEIVED: {
      const result = { ...state };

      const stateData = action.data.aggregations.state;
      const issueData = action.data.aggregations.issue;
      const productData = action.data.aggregations.product;

      result.state = processStateAggregations( stateData )
      result.issue = processAggregations( issueData )
      result.product = processAggregations( productData )
      result.trends = processLineChart(productData)
      return result;
    }

    case COMPLAINTS_FAILED:
      return {
        ...defaultState,
        error: action.error
      }

    default:
      return state
  }
}
