import target, {
  defaultState,
  processTrends
} from '../trends'
import actions from '../../actions'
import trendsResults from '../__fixtures__/trendsResults'

describe( 'reducer:trends', () => {
  let action

  describe( 'reducer', () => {
    it( 'has a default state', () => {
      expect( target( undefined, {} ) ).toEqual( {
        activeCall: '',
        chartType: 'line',
        colorMap: {},
        expandedTrends: [],
        filterNames: [],
        focus: false,
        isLoading: false,
        lastDate: false,
        lens: 'Overview',
        results: {
          dateRangeArea: [],
          dateRangeLine: [],
          dateRangeBrush: [],
          issue: [],
          product: []
        },
        subLens: '',
        tooltip: false
      } )
    } )
  } )

  describe( 'CHART_TYPE_CHANGED action', () => {

  } )

  describe( 'DATA_LENS_CHANGED action', () => {

  } )

  describe( 'TAB_CHANGED action', () => {

  } )

  describe( 'TRENDS_API_CALLED actions', () => {
    action = {
      type: actions.TRENDS_API_CALLED,
      url: 'http://www.example.org'
    }
    expect( target( {}, action ) ).toEqual( {
      activeCall: 'http://www.example.org',
      isLoading: true
    } )
  } )

  describe( 'TRENDS_FAILED actions', () => {
    it( 'handles failed error messages', () => {
      action = {
        type: actions.TRENDS_FAILED,
        error: { message: 'foo bar', name: 'ErrorTypeName' }
      }
      expect( target( {
        activeCall: 'someurl',
        results: {
          dateRangeArea: [ 1, 2, 3 ],
          dateRangeBrush: [ 4, 5, 6 ],
          dateRangeLine: [ 7, 8, 9 ],
          issue: [ 10, 11, 12 ],
          product: [ 13, 25 ]
        }
      }, action ) ).toEqual( {
        activeCall: '',
        error: { message: 'foo bar', name: 'ErrorTypeName' },
        isLoading: false,
        results: {
          dateRangeArea: [],
          dateRangeBrush: [],
          dateRangeLine: [],
          issue: [],
          product: []
        }
      } )
    } )
  } )

  describe( 'TRENDS_RECEIVED actions', () => {
    beforeEach( () => {
      action = {
        type: actions.TRENDS_RECEIVED,
        data: {
          aggregations: trendsResults
        }
      }
    } )


    it( 'maps data to object state - Overview', () => {
      const result = target( defaultState, action )

      console.log( JSON.stringify( result.results ) )

      expect( result ).toEqual( {
        activeCall: '',
        chartType: 'line',
        focus: false,
        isLoading: false,
        results: {
          "dateRangeArea": [],
          "dateRangeBrush": [
            { date: new Date( '2020-01-01T00:00:00.000Z' ), value: 26413 },
            { date: new Date( '2020-02-01T00:00:00.000Z' ), value: 25096 },
            { date: new Date( '2020-03-01T00:00:00.000Z' ), value: 29506 },
            { date: new Date( '2020-04-01T00:00:00.000Z' ), value: 35112 },
            { date: new Date( '2020-05-01T00:00:00.000Z' ), value: 9821 }
          ],
          "dateRangeLine": {
            "dataByTopic": [ {
              "topic": "Complaints",
              "topicName": "Complaints",
              "dashed": false,
              "show": true,
              "dates": [
                { date: new Date( '2020-03-01T00:00:00.000Z' ), value: 29506 },
                { date: new Date( '2020-04-01T00:00:00.000Z' ), value: 35112 },
                { date: new Date( '2020-05-01T00:00:00.000Z' ), value: 9821 }
              ]
            } ]
          },
          issue:
            [
              {
                hasChildren: true,
                isNotFilter: false,
                isParent: true,
                "pctChange": 24.04,
                "pctOfSet": 44.35,
                "name": "Incorrect information on your report",
                value: 33017,
                "parent": false,
                "visible": true,
                "width": 0.5
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 27.24,
                "pctOfSet": 32.78,
                "name": "Information belongs to someone else",
                value: 24403,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 2.56,
                "pctOfSet": 4.09,
                "name": "Account status incorrect",
                value: 3042,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 25.64,
                "pctOfSet": 3.83,
                "name": "Account information incorrect",
                value: 2849,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 23.96,
                "pctOfSet": 1.43,
                "name": "Personal information incorrect",
                value: 1066,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 5.69,
                "pctOfSet": 0.78,
                "name": "Public record information inaccurate",
                value: 578,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 23.01,
                "pctOfSet": 0.77,
                "name": "Old information reappears or never goes away",
                value: 576,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 54.87,
                "pctOfSet": 0.47,
                "name": "Information is missing that should be on the report",
                value: 348,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              },
              {
                hasChildren: false,
                isNotFilter: false,
                isParent: false,
                "pctChange": 6.67,
                "pctOfSet": 0.05,
                "name": "Information is incorrect",
                value: 36,
                "parent": "Incorrect information on your report",
                "visible": false,
                "width": 0.4
              }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 150,
              "pctOfSet": 0.01,
              "name": "Information that should be on the report is missing",
              value: 9,
              "parent": "Incorrect information on your report",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 26.71,
              "pctOfSet": 12.5,
              "name": "Problem with a credit reporting company's investigation into an existing problem",
              value: 9307,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 17.16,
              "pctOfSet": 7.67,
              "name": "Their investigation did not fix an error on your report",
              value: 5706,
              "parent": "Problem with a credit reporting company's investigation into an existing problem",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 27.59,
              "pctOfSet": 2.11,
              "name": "Investigation took more than 30 days",
              value: 1572,
              "parent": "Problem with a credit reporting company's investigation into an existing problem",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 78.95,
              "pctOfSet": 1.58,
              "name": "Was not notified of investigation status or results",
              value: 1173,
              "parent": "Problem with a credit reporting company's investigation into an existing problem",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 75.16,
              "pctOfSet": 0.66,
              "name": "Difficulty submitting a dispute or getting information about a dispute over the phone",
              value: 495,
              "parent": "Problem with a credit reporting company's investigation into an existing problem",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 10.22,
              "pctOfSet": 0.44,
              "name": "Problem with personal statement of dispute",
              value: 329,
              "parent": "Problem with a credit reporting company's investigation into an existing problem",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 5.91,
              "pctOfSet": 7.21,
              "name": "Attempts to collect debt not owed",
              value: 5370,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -2.94,
              "pctOfSet": 3.45,
              "name": "Debt is not yours",
              value: 2571,
              "parent": "Attempts to collect debt not owed",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 14.34,
              "pctOfSet": 2.38,
              "name": "Debt was result of identity theft",
              value: 1771,
              "parent": "Attempts to collect debt not owed",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 15.34,
              "pctOfSet": 1.17,
              "name": "Debt was paid",
              value: 868,
              "parent": "Attempts to collect debt not owed",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 14.93,
              "pctOfSet": 0.21,
              "name": "Debt was already discharged in bankruptcy and is no longer owed",
              value: 160,
              "parent": "Attempts to collect debt not owed",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 21.33,
              "pctOfSet": 3.46,
              "name": "Managing an account",
              value: 2572,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 31.79,
              "pctOfSet": 1.13,
              "name": "Deposits and withdrawals",
              value: 841,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 14.36,
              "pctOfSet": 0.6,
              "name": "Problem using a debit or ATM card",
              value: 446,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 9.8,
              "pctOfSet": 0.47,
              "name": "Banking errors",
              value: 351,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -11.2,
              "pctOfSet": 0.34,
              "name": "Funds not handled or disbursed as instructed",
              value: 252,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 85.71,
              "pctOfSet": 0.33,
              "name": "Problem accessing account",
              value: 245,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 69.23,
              "pctOfSet": 0.22,
              "name": "Problem making or receiving payments",
              value: 163,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 14.75,
              "pctOfSet": 0.19,
              "name": "Fee problem",
              value: 141,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -19.57,
              "pctOfSet": 0.12,
              "name": "Cashing a check",
              value: 93,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -18.18,
              "pctOfSet": 0.03,
              "name": "Deposits or withdrawals",
              value: 21,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": NaN,
              "pctOfSet": 0.01,
              "name": "Problem with renewal",
              value: 10,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": NaN,
              "pctOfSet": 0.01,
              "name": "Problem with fees or penalties",
              value: 9,
              "parent": "Managing an account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 5.41,
              "pctOfSet": 3.18,
              "name": "Improper use of your report",
              value: 2370,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -6.92,
              "pctOfSet": 2.25,
              "name": "Credit inquiries on your report that you don't recognize",
              value: 1678,
              "parent": "Improper use of your report",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 49.05,
              "pctOfSet": 0.87,
              "name": "Reporting company used your report improperly",
              value: 647,
              "parent": "Improper use of your report",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -27.27,
              "pctOfSet": 0.03,
              "name": "Received unsolicited financial product or insurance offers after opting out",
              value: 22,
              "parent": "Improper use of your report",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -20,
              "pctOfSet": 0.01,
              "name": "Report provided to employer without your written authorization",
              value: 10,
              "parent": "Improper use of your report",
              "visible": false,
              "width": 0.4
            } ],
          "product":
            [ {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 22.91,
              "pctOfSet": 60.83,
              "name": "Credit reporting, credit repair services, or other personal consumer reports",
              value: 45278,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 22.92,
              "pctOfSet": 60.31,
              "name": "Credit reporting",
              value: 44896,
              "parent": "Credit reporting, credit repair services, or other personal consumer reports",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 22.95,
              "pctOfSet": 0.4,
              "name": "Other personal consumer report",
              value: 301,
              "parent": "Credit reporting, credit repair services, or other personal consumer reports",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 17.14,
              "pctOfSet": 0.11,
              "name": "Credit repair services",
              value: 81,
              "parent": "Credit reporting, credit repair services, or other personal consumer reports",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 7.18,
              "pctOfSet": 13.14,
              "name": "Debt collection",
              value: 9782,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -10.18,
              "pctOfSet": 3.62,
              "name": "Other debt",
              value: 2692,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 16.77,
              "pctOfSet": 3.29,
              "name": "I do not know",
              value: 2449,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 20.19,
              "pctOfSet": 3.03,
              "name": "Credit card debt",
              value: 2258,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 21.09,
              "pctOfSet": 1.89,
              "name": "Medical debt",
              value: 1408,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 1.48,
              "pctOfSet": 0.42,
              "name": "Auto debt",
              value: 310,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -14.18,
              "pctOfSet": 0.39,
              "name": "Payday loan debt",
              value: 287,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 2.47,
              "pctOfSet": 0.24,
              "name": "Mortgage debt",
              value: 175,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -28.81,
              "pctOfSet": 0.14,
              "name": "Federal student loan debt",
              value: 107,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -22,
              "pctOfSet": 0.13,
              "name": "Private student loan debt",
              value: 96,
              "parent": "Debt collection",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 28.83,
              "pctOfSet": 8.44,
              "name": "Credit card or prepaid card",
              value: 6284,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 15.81,
              "pctOfSet": 6.26,
              "name": "General-purpose credit card or charge card",
              value: 4657,
              "parent": "Credit card or prepaid card",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 6.58,
              "pctOfSet": 1.11,
              "name": "Store credit card",
              value: 828,
              "parent": "Credit card or prepaid card",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 503.7,
              "pctOfSet": 0.56,
              "name": "Government benefit card",
              value: 414,
              "parent": "Credit card or prepaid card",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 94.06,
              "pctOfSet": 0.45,
              "name": "General-purpose prepaid card",
              value: 337,
              "parent": "Credit card or prepaid card",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 144.44,
              "pctOfSet": 0.04,
              "name": "Payroll card",
              value: 33,
              "parent": "Credit card or prepaid card",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -14.29,
              "pctOfSet": 0.02,
              "name": "Gift card",
              value: 14,
              "parent": "Credit card or prepaid card",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": NaN,
              "pctOfSet": 0,
              "name": "Student prepaid card",
              value: 1,
              "parent": "Credit card or prepaid card",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 2.2,
              "pctOfSet": 6.28,
              "name": "Mortgage",
              value: 4676,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 1.32,
              "pctOfSet": 3.99,
              "name": "Conventional home mortgage",
              value: 2971,
              "parent": "Mortgage",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 5.41,
              "pctOfSet": 1.06,
              "name": "FHA mortgage",
              value: 788,
              "parent": "Mortgage",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 12.58,
              "pctOfSet": 0.47,
              "name": "VA mortgage",
              value: 350,
              "parent": "Mortgage",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -18.44,
              "pctOfSet": 0.37,
              "name": "Other type of mortgage",
              value: 279,
              "parent": "Mortgage",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 20.59,
              "pctOfSet": 0.33,
              "name": "Home equity loan or line of credit (HELOC)",
              value: 243,
              "parent": "Mortgage",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -17.39,
              "pctOfSet": 0.06,
              "name": "Reverse mortgage",
              value: 45,
              "parent": "Mortgage",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: true,
              isNotFilter: false,
              isParent: true,
              "pctChange": 20.26,
              "pctOfSet": 5.51,
              "name": "Checking or savings account",
              value: 4101,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 24.67,
              "pctOfSet": 4.28,
              "name": "Checking account",
              value: 3187,
              "parent": "Checking or savings account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 10.23,
              "pctOfSet": 0.66,
              "name": "Other banking product or service",
              value: 494,
              "parent": "Checking or savings account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": 10.69,
              "pctOfSet": 0.4,
              "name": "Savings account",
              value: 298,
              "parent": "Checking or savings account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": -15,
              "pctOfSet": 0.16,
              "name": "CD (Certificate of Deposit)",
              value: 121,
              "parent": "Checking or savings account",
              "visible": false,
              "width": 0.4
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: false,
              "pctChange": NaN,
              "pctOfSet": 0,
              "name": "Personal line of credit",
              value: 1,
              "parent": "Checking or savings account",
              "visible": false,
              "width": 0.4
            } ],
          "collections":
            [ {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              "pctChange": 18.17,
              "pctOfSet": 6.95,
              "name": "Servicemember",
              value: 5172,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              "pctChange": -5.91,
              "pctOfSet": 3.16,
              "name": "Older American",
              value: 2352,
              "parent": false,
              "visible": true,
              "width": 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              "pctChange": -10.75,
              "pctOfSet": 0.86,
              "name": "Older American, Servicemember",
              value: 640,
              "parent": false,
              "visible": true,
              "width": 0.5
            } ]
        }
      } )
    } )
  } )

  describe( 'TREND_TOGGLED action', () => {

  } )

  describe( 'TRENDS_TOOLTIP_CHANGED action', () => {

  } )

  describe( 'URL_CHANGED actions', () => {
    let action
    let state
    beforeEach( () => {
      action = {
        type: actions.URL_CHANGED,
        params: {}
      }

      state = { ...defaultState }
    } )

    it( 'handles empty params', () => {
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles lens params', () => {
      action.params = { lens: 'hello', subLens: 'mom', nope: 'hi' }

      const actual = target( state, action )
      expect( actual.lens ).toEqual( 'hello' )
      expect( actual.subLens ).toEqual( 'mom' )
      expect( actual.nope ).toBeFalsy()
    } )
  } )
} )
