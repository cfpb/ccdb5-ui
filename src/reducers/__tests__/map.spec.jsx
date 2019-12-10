import target, { processAggregations } from '../map'
import * as types from '../../constants'
import * as sut from '../../actions/complaints'

describe('reducer:map', () => {
  let action

  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
      issue: [],
      product: [],
      state: []
    })
  })

  describe('handles API_CALLED actions', () => {
    action = {
      type: types.API_CALLED,
      url: 'http://www.example.org'
    }
    expect(target({}, action)).toEqual({
      activeCall: 'http://www.example.org',
      isLoading: true
    })
  })

  describe('handles COMPLAINTS_RECEIVED actions', () => {
    beforeEach(() => {
      action = {
        type: sut.COMPLAINTS_RECEIVED,
        data: {
          aggregations: {
            foo: {},
            issue: {
              doc_count: 469472,
              issue:{
                buckets: [
                  {
                    key: 'Incorrect information on your report',
                    doc_count: 72915
                  },
                  {
                    key: 'Problem with a credit reporting company\'s investigation into an existing problem',
                    doc_count: 36432
                  },
                  {
                    key: 'Attempts to collect debt not owed',
                    doc_count: 27080
                  },
                  {
                    key: 'Incorrect information on credit report',
                    doc_count: 21217
                  },
                  {
                    key: 'Improper use of your report',
                    doc_count: 19666
                  },
                  {
                    key: 'Cont\'d attempts collect debt not owed',
                    doc_count: 17434
                  },
                  {
                    key: 'Loan servicing, payments, escrow account',
                    doc_count: 14722
                  },
                  {
                    key: 'Communication tactics',
                    doc_count: 13366
                  },
                ]
              }
            },
            product: {
              doc_count: 469472,
              product: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                  {
                    key: 'Credit reporting, credit repair services, or other personal consumer reports',
                    doc_count: 134170
                  },
                  {
                    key: 'Debt collection',
                    doc_count: 102661
                  },
                  {
                    key: 'Mortgage',
                    doc_count: 59784
                  },
                  {
                    key: 'Credit reporting',
                    doc_count: 31588
                  },
                  {
                    key: 'Credit card or prepaid card',
                    doc_count: 29772
                  },
                  {
                    key: 'Student loan',
                    doc_count: 24425
                  },
                  {
                    key: 'Credit card',
                    doc_count: 18838
                  },
                  {
                    key: 'Checking or savings account',
                    doc_count: 17885
                  },
                ]
              }
            },
            state: {
              doc_count: 469472,
              state: {
                buckets: [
                  {
                    key: 'CA',
                    doc_count: 62519
                  },
                  {
                    key: 'FL',
                    doc_count: 47358
                  },
                  {
                    key: 'TX',
                    doc_count: 44469
                  },
                  {
                    key: 'GA',
                    doc_count: 28395
                  },
                  {
                    key: 'NY',
                    doc_count: 26846
                  },
                  {
                    key: 'IL',
                    doc_count: 18172
                  },
                  {
                    key: 'PA',
                    doc_count: 16054
                  },
                  {
                    key: 'NC',
                    doc_count: 15217
                  },
                  {
                    key: 'NJ',
                    doc_count: 15130
                  },
                  {
                    key: 'OH',
                    doc_count: 14365
                  },
                  {
                    key: 'VA',
                    doc_count: 12901
                  },
                  {
                    key: 'MD',
                    doc_count: 12231
                  },
                  {
                    key: 'MI',
                    doc_count: 10472
                  },
                  {
                    key: 'AZ',
                    doc_count: 10372
                  },
                  {
                    key: 'TN',
                    doc_count: 9011
                  },
                  {
                    key: 'WA',
                    doc_count: 8542
                  },
                  {
                    key: 'MA',
                    doc_count: 8254
                  },
                  {
                    key: 'MO',
                    doc_count: 7832
                  },
                  {
                    key: 'SC',
                    doc_count: 7496
                  },
                  {
                    key: 'CO',
                    doc_count: 7461
                  },
                  {
                    key: 'NV',
                    doc_count: 7095
                  },
                  {
                    key: 'LA',
                    doc_count: 6369
                  },
                  {
                    key: 'AL',
                    doc_count: 6178
                  },
                  {
                    key: 'IN',
                    doc_count: 5659
                  },
                  {
                    key: 'MN',
                    doc_count: 4957
                  },
                  {
                    key: 'CT',
                    doc_count: 4685
                  },
                  {
                    key: 'WI',
                    doc_count: 4443
                  },
                  {
                    key: 'OR',
                    doc_count: 4261
                  },
                  {
                    key: 'UT',
                    doc_count: 3693
                  },
                  {
                    key: 'KY',
                    doc_count: 3392
                  },
                  {
                    key: 'MS',
                    doc_count: 3237
                  },
                  {
                    key: 'OK',
                    doc_count: 2989
                  },
                  {
                    key: 'AR',
                    doc_count: 2691
                  },
                  {
                    key: 'DC',
                    doc_count: 2493
                  },
                  {
                    key: 'KS',
                    doc_count: 2307
                  },
                  {
                    key: 'NM',
                    doc_count: 2176
                  },
                  {
                    key: 'DE',
                    doc_count: 2160
                  },
                  {
                    key: '',
                    doc_count: 1824
                  },
                  {
                    key: 'IA',
                    doc_count: 1751
                  },
                  {
                    key: 'HI',
                    doc_count: 1552
                  },
                  {
                    key: 'ID',
                    doc_count: 1436
                  },
                  {
                    key: 'NH',
                    doc_count: 1408
                  },
                  {
                    key: 'NE',
                    doc_count: 1343
                  },
                  {
                    key: 'RI',
                    doc_count: 1166
                  },
                  {
                    key: 'ME',
                    doc_count: 1155
                  },
                  {
                    key: 'WV',
                    doc_count: 1075
                  },
                  {
                    key: 'PR',
                    doc_count: 909
                  },
                  {
                    key: 'MT',
                    doc_count: 788
                  },
                  {
                    key: 'ND',
                    doc_count: 637
                  },
                  {
                    key: 'SD',
                    doc_count: 535
                  },
                  {
                    key: 'AK',
                    doc_count: 524
                  },
                  {
                    key: 'WY',
                    doc_count: 450
                  },
                  {
                    key: 'VT',
                    doc_count: 446
                  },
                  {
                    key: 'AE',
                    doc_count: 194
                  },
                  {
                    key: 'AP',
                    doc_count: 153
                  },
                  {
                    key: 'GU',
                    doc_count: 85
                  },
                  {
                    key: 'FM',
                    doc_count: 54
                  },
                  {
                    key: 'VI',
                    doc_count: 51
                  },
                  {
                    key: 'UNITED STATES MINOR OUTLYING ISLANDS',
                    doc_count: 28
                  },
                  {
                    key: 'AA',
                    doc_count: 9
                  },
                  {
                    key: 'MP',
                    doc_count: 7
                  },
                  {
                    key: 'AS',
                    doc_count: 6
                  },
                  {
                    key: 'MH',
                    doc_count: 3
                  },
                  {
                    key: 'PW',
                    doc_count: 1
                  }
                ]
              }
            }
          }
        }
      }
    })


    it('maps data to object state', () => {
      const result = target( null, action );
      expect( result ).toEqual( {
        "state": [
          {
            "name": "CA",
            "value": 62519,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "FL",
            "value": 47358,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "TX",
            "value": 44469,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "GA",
            "value": 28395,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "NY",
            "value": 26846,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "IL",
            "value": 18172,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "PA",
            "value": 16054,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "NC",
            "value": 15217,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "NJ",
            "value": 15130,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "OH",
            "value": 14365,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "VA",
            "value": 12901,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "MD",
            "value": 12231,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "MI",
            "value": 10472,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "AZ",
            "value": 10372,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "TN",
            "value": 9011,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "WA",
            "value": 8542,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "MA",
            "value": 8254,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "MO",
            "value": 7832,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "SC",
            "value": 7496,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "CO",
            "value": 7461,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "NV",
            "value": 7095,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "LA",
            "value": 6369,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "AL",
            "value": 6178,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "IN",
            "value": 5659,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "MN",
            "value": 4957,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "CT",
            "value": 4685,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "WI",
            "value": 4443,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "OR",
            "value": 4261,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "UT",
            "value": 3693,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "KY",
            "value": 3392,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "MS",
            "value": 3237,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "OK",
            "value": 2989,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "AR",
            "value": 2691,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "DC",
            "value": 2493,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "KS",
            "value": 2307,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "NM",
            "value": 2176,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "DE",
            "value": 2160,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "IA",
            "value": 1751,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "HI",
            "value": 1552,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "ID",
            "value": 1436,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "NH",
            "value": 1408,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "NE",
            "value": 1343,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "RI",
            "value": 1166,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "ME",
            "value": 1155,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "WV",
            "value": 1075,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "MT",
            "value": 788,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "ND",
            "value": 637,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "SD",
            "value": 535,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "AK",
            "value": 524,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "WY",
            "value": 450,
            "issue": "Being broke",
            "product": "Some Product Name"
          }, {
            "name": "VT",
            "value": 446,
            "issue": "Being broke",
            "product": "Some Product Name"
          } ],
        "issue": [
          {
            "name": "Incorrect information on your report",
            "value": 72915,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "16.00",
            "width": 0.5
          }, {
            "name": "Problem with a credit reporting company's investigation into an existing problem",
            "value": 36432,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "8.00",
            "width": 0.5
          }, {
            "name": "Attempts to collect debt not owed",
            "value": 27080,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "6.00",
            "width": 0.5
          }, {
            "name": "Incorrect information on credit report",
            "value": 21217,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "5.00",
            "width": 0.5
          }, {
            "name": "Improper use of your report",
            "value": 19666,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "4.00",
            "width": 0.5
          }, {
            "name": "Cont'd attempts collect debt not owed",
            "value": 17434,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "4.00",
            "width": 0.5
          }, {
            "name": "Loan servicing, payments, escrow account",
            "value": 14722,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "3.00",
            "width": 0.5
          }, {
            "name": "Communication tactics",
            "value": 13366,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "3.00",
            "width": 0.5
          }],
        "product": [
          {
            "name": "Credit reporting, credit repair services, or other personal consumer reports",
            "value": 134170,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "29.00",
            "width": 0.5
          }, {
            "name": "Debt collection",
            "value": 102661,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "22.00",
            "width": 0.5
          }, {
            "name": "Mortgage",
            "value": 59784,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "13.00",
            "width": 0.5
          }, {
            "name": "Credit reporting",
            "value": 31588,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "7.00",
            "width": 0.5
          }, {
            "name": "Credit card or prepaid card",
            "value": 29772,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "6.00",
            "width": 0.5
          }, {
            "name": "Student loan",
            "value": 24425,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "5.00",
            "width": 0.5
          }, {
            "name": "Credit card",
            "value": 18838,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "4.00",
            "width": 0.5
          }, {
            "name": "Checking or savings account",
            "value": 17885,
            "pctChange": 1,
            "isParent": true,
            "hasChildren": false,
            "pctOfSet": "4.00",
            "width": 0.5
          }]
      } )
    })
  })

  it('handles COMPLAINTS_FAILED actions', () => {
    action = {
      type: sut.COMPLAINTS_FAILED,
      error: 'foo bar'
    }
    expect(target({doc_count: 100, items: [1, 2, 3]}, action)).toEqual({
      error: 'foo bar',
      issue: [],
      product: [],
      state: []
    })
  })
})
