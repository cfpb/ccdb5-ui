import target from '../map'
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
                    doc_count: 72915,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Information belongs to someone else',
                          doc_count: 29630
                        },
                        {
                          key: 'Account status incorrect',
                          doc_count: 14900
                        },
                        {
                          key: 'Account information incorrect',
                          doc_count: 14356
                        },
                        {
                          key: 'Old information reappears or never goes away',
                          doc_count: 4114
                        },
                        {
                          key: 'Public record information inaccurate',
                          doc_count: 3755
                        },
                        {
                          key: 'Personal information incorrect',
                          doc_count: 3670
                        },
                        {
                          key: 'Information is missing that should be on the report',
                          doc_count: 1649
                        },
                        {
                          key: '',
                          doc_count: 496
                        },
                        {
                          key: 'Information is incorrect',
                          doc_count: 292
                        },
                        {
                          key: 'Information that should be on the report is missing',
                          doc_count: 53
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with a credit reporting company\'s investigation into an existing problem',
                    doc_count: 36432,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Their investigation did not fix an error on your report',
                          doc_count: 25985
                        },
                        {
                          key: 'Investigation took more than 30 days',
                          doc_count: 2856
                        },
                        {
                          key: 'Difficulty submitting a dispute or getting information about a dispute over the phone',
                          doc_count: 2776
                        },
                        {
                          key: 'Was not notified of investigation status or results',
                          doc_count: 2408
                        },
                        {
                          key: 'Problem with personal statement of dispute',
                          doc_count: 2234
                        },
                        {
                          key: '',
                          doc_count: 173
                        }
                      ]
                    }
                  },
                  {
                    key: 'Attempts to collect debt not owed',
                    doc_count: 27080,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Debt is not yours',
                          doc_count: 14069
                        },
                        {
                          key: 'Debt was paid',
                          doc_count: 6132
                        },
                        {
                          key: 'Debt was result of identity theft',
                          doc_count: 5449
                        },
                        {
                          key: 'Debt was already discharged in bankruptcy and is no longer owed',
                          doc_count: 1430
                        }
                      ]
                    }
                  },
                  {
                    key: 'Incorrect information on credit report',
                    doc_count: 21217,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Information is not mine',
                          doc_count: 7102
                        },
                        {
                          key: 'Account status',
                          doc_count: 5139
                        },
                        {
                          key: 'Account terms',
                          doc_count: 2738
                        },
                        {
                          key: 'Public record',
                          doc_count: 2682
                        },
                        {
                          key: 'Reinserted previously deleted info',
                          doc_count: 2028
                        },
                        {
                          key: 'Personal information',
                          doc_count: 1528
                        }
                      ]
                    }
                  },
                  {
                    key: 'Improper use of your report',
                    doc_count: 19666,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Credit inquiries on your report that you don\'t recognize',
                          doc_count: 12686
                        },
                        {
                          key: 'Reporting company used your report improperly',
                          doc_count: 6536
                        },
                        {
                          key: 'Received unsolicited financial product or insurance offers after opting out',
                          doc_count: 206
                        },
                        {
                          key: 'Report provided to employer without your written authorization',
                          doc_count: 191
                        },
                        {
                          key: '',
                          doc_count: 47
                        }
                      ]
                    }
                  },
                  {
                    key: 'Cont\'d attempts collect debt not owed',
                    doc_count: 17434,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Debt is not mine',
                          doc_count: 10105
                        },
                        {
                          key: 'Debt was paid',
                          doc_count: 4684
                        },
                        {
                          key: 'Debt resulted from identity theft',
                          doc_count: 1983
                        },
                        {
                          key: 'Debt was discharged in bankruptcy',
                          doc_count: 662
                        }
                      ]
                    }
                  },
                  {
                    key: 'Loan servicing, payments, escrow account',
                    doc_count: 14722,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 14722
                        }
                      ]
                    }
                  },
                  {
                    key: 'Communication tactics',
                    doc_count: 13366,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Frequent or repeated calls',
                          doc_count: 7346
                        },
                        {
                          key: 'You told them to stop contacting you, but they keep trying',
                          doc_count: 2287
                        },
                        {
                          key: 'Threatened to take legal action',
                          doc_count: 1265
                        },
                        {
                          key: 'Used obscene, profane, or other abusive language',
                          doc_count: 875
                        },
                        {
                          key: 'Used obscene/profane/abusive language',
                          doc_count: 594
                        },
                        {
                          key: 'Called after sent written cease of comm',
                          doc_count: 448
                        },
                        {
                          key: 'Called before 8am or after 9pm',
                          doc_count: 316
                        },
                        {
                          key: 'Called outside of 8am-9pm',
                          doc_count: 235
                        }
                      ]
                    }
                  },
                  {
                    key: 'Trouble during payment process',
                    doc_count: 12599,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 12599
                        }
                      ]
                    }
                  },
                  {
                    key: 'Written notification about debt',
                    doc_count: 11873,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Didn\'t receive enough information to verify debt',
                          doc_count: 7301
                        },
                        {
                          key: 'Didn\'t receive notice of right to dispute',
                          doc_count: 4160
                        },
                        {
                          key: 'Notification didn\'t disclose it was an attempt to collect a debt',
                          doc_count: 412
                        }
                      ]
                    }
                  },
                  {
                    key: 'Loan modification,collection,foreclosure',
                    doc_count: 10789,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 10789
                        }
                      ]
                    }
                  },
                  {
                    key: 'False statements or representation',
                    doc_count: 10208,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Attempted to collect wrong amount',
                          doc_count: 7914
                        },
                        {
                          key: 'Impersonated attorney, law enforcement, or government official',
                          doc_count: 822
                        },
                        {
                          key: 'Impersonated an attorney or official',
                          doc_count: 437
                        },
                        {
                          key: 'Indicated committed crime not paying',
                          doc_count: 384
                        },
                        {
                          key: 'Indicated you were committing crime by not paying debt',
                          doc_count: 349
                        },
                        {
                          key: 'Told you not to respond to a lawsuit they filed against you',
                          doc_count: 161
                        },
                        {
                          key: 'Indicated shouldn\'t respond to lawsuit',
                          doc_count: 141
                        }
                      ]
                    }
                  },
                  {
                    key: 'Managing an account',
                    doc_count: 9696,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Deposits and withdrawals',
                          doc_count: 2699
                        },
                        {
                          key: 'Problem using a debit or ATM card',
                          doc_count: 1657
                        },
                        {
                          key: 'Banking errors',
                          doc_count: 1294
                        },
                        {
                          key: 'Fee problem',
                          doc_count: 1153
                        },
                        {
                          key: 'Funds not handled or disbursed as instructed',
                          doc_count: 1150
                        },
                        {
                          key: 'Problem accessing account',
                          doc_count: 784
                        },
                        {
                          key: 'Problem making or receiving payments',
                          doc_count: 571
                        },
                        {
                          key: 'Cashing a check',
                          doc_count: 300
                        },
                        {
                          key: 'Deposits or withdrawals',
                          doc_count: 55
                        },
                        {
                          key: 'Problem with fees or penalties',
                          doc_count: 17
                        },
                        {
                          key: 'Problem with renewal',
                          doc_count: 16
                        }
                      ]
                    }
                  },
                  {
                    key: 'Dealing with your lender or servicer',
                    doc_count: 8815,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Received bad information about your loan',
                          doc_count: 3190
                        },
                        {
                          key: 'Trouble with how payments are being handled',
                          doc_count: 3057
                        },
                        {
                          key: 'Don\'t agree with the fees charged',
                          doc_count: 909
                        },
                        {
                          key: 'Problem with customer service',
                          doc_count: 806
                        },
                        {
                          key: 'Need information about your loan balance or loan terms',
                          doc_count: 499
                        },
                        {
                          key: 'Keep getting calls about your loan',
                          doc_count: 354
                        }
                      ]
                    }
                  },
                  {
                    key: 'Struggling to pay mortgage',
                    doc_count: 8095,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 8095
                        }
                      ]
                    }
                  },
                  {
                    key: 'Dealing with my lender or servicer',
                    doc_count: 7909,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Trouble with how payments are handled',
                          doc_count: 2564
                        },
                        {
                          key: 'Received bad information about my loan',
                          doc_count: 1898
                        },
                        {
                          key: 'Don\'t agree with fees charged',
                          doc_count: 1292
                        },
                        {
                          key: 'Having problems with customer service',
                          doc_count: 1193
                        },
                        {
                          key: 'Keep getting calls about my loan',
                          doc_count: 496
                        },
                        {
                          key: 'Need information about my balance/terms',
                          doc_count: 466
                        }
                      ]
                    }
                  },
                  {
                    key: 'Disclosure verification of debt',
                    doc_count: 7590,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Not given enough info to verify debt',
                          doc_count: 4434
                        },
                        {
                          key: 'Right to dispute notice not received',
                          doc_count: 2552
                        },
                        {
                          key: 'Not disclosed as an attempt to collect',
                          doc_count: 604
                        }
                      ]
                    }
                  },
                  {
                    key: 'Managing the loan or lease',
                    doc_count: 7378,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 4519
                        },
                        {
                          key: 'Billing problem',
                          doc_count: 1579
                        },
                        {
                          key: 'Problem with fees charged',
                          doc_count: 512
                        },
                        {
                          key: 'Problem with additional products or services purchased with the loan',
                          doc_count: 337
                        },
                        {
                          key: 'Problem with the interest rate',
                          doc_count: 285
                        },
                        {
                          key: 'Loan sold or transferred to another company',
                          doc_count: 146
                        }
                      ]
                    }
                  },
                  {
                    key: 'Took or threatened to take negative or legal action',
                    doc_count: 7353,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Threatened or suggested your credit would be damaged',
                          doc_count: 3184
                        },
                        {
                          key: 'Threatened to sue you for very old debt',
                          doc_count: 1578
                        },
                        {
                          key: 'Sued you without properly notifying you of lawsuit',
                          doc_count: 773
                        },
                        {
                          key: 'Seized or attempted to seize your property',
                          doc_count: 676
                        },
                        {
                          key: 'Threatened to arrest you or take you to jail if you do not pay',
                          doc_count: 623
                        },
                        {
                          key: 'Collected or attempted to collect exempt funds',
                          doc_count: 347
                        },
                        {
                          key: 'Sued you in a state where you do not live or did not sign for the debt',
                          doc_count: 165
                        },
                        {
                          key: 'Threatened to turn you in to immigration or deport you',
                          doc_count: 7
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with a purchase shown on your statement',
                    doc_count: 6581,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Credit card company isn\'t resolving a dispute about a purchase on your statement',
                          doc_count: 4357
                        },
                        {
                          key: 'Card was charged for something you did not purchase with the card',
                          doc_count: 2002
                        },
                        {
                          key: 'Overcharged for something you did purchase with the card',
                          doc_count: 222
                        }
                      ]
                    }
                  },
                  {
                    key: 'Account opening, closing, or management',
                    doc_count: 6347,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 6347
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit reporting company\'s investigation',
                    doc_count: 5663,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'No notice of investigation status/result',
                          doc_count: 2401
                        },
                        {
                          key: 'Problem with statement of dispute',
                          doc_count: 1697
                        },
                        {
                          key: 'Investigation took too long',
                          doc_count: 962
                        },
                        {
                          key: 'Inadequate help over the phone',
                          doc_count: 603
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other features, terms, or problems',
                    doc_count: 4221,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Other problem',
                          doc_count: 1923
                        },
                        {
                          key: 'Problem with rewards from credit card',
                          doc_count: 1082
                        },
                        {
                          key: 'Problem with customer service',
                          doc_count: 466
                        },
                        {
                          key: 'Problem with balance transfer',
                          doc_count: 265
                        },
                        {
                          key: 'Privacy issues',
                          doc_count: 201
                        },
                        {
                          key: 'Add-on products and services',
                          doc_count: 182
                        },
                        {
                          key: 'Credit card company forcing arbitration',
                          doc_count: 46
                        },
                        {
                          key: 'Problem with cash advances',
                          doc_count: 37
                        },
                        {
                          key: 'Problem with convenience check',
                          doc_count: 19
                        }
                      ]
                    }
                  },
                  {
                    key: 'Fees or interest',
                    doc_count: 4011,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Problem with fees',
                          doc_count: 2617
                        },
                        {
                          key: 'Charged too much interest',
                          doc_count: 1017
                        },
                        {
                          key: 'Unexpected increase in interest rate',
                          doc_count: 377
                        }
                      ]
                    }
                  },
                  {
                    key: 'Application, originator, mortgage broker',
                    doc_count: 3746,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 3746
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem when making payments',
                    doc_count: 3703,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Problem during payment process',
                          doc_count: 2139
                        },
                        {
                          key: 'You never received your bill or did not know a payment was due',
                          doc_count: 905
                        },
                        {
                          key: '',
                          doc_count: 659
                        }
                      ]
                    }
                  },
                  {
                    key: 'Deposits and withdrawals',
                    doc_count: 3425,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 3425
                        }
                      ]
                    }
                  },
                  {
                    key: 'Struggling to repay your loan',
                    doc_count: 3405,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Can\'t get other flexible options for repaying your loan',
                          doc_count: 1797
                        },
                        {
                          key: 'Problem lowering your monthly payments',
                          doc_count: 1156
                        },
                        {
                          key: 'Can\'t temporarily delay making payments',
                          doc_count: 452
                        }
                      ]
                    }
                  },
                  {
                    key: 'Fraud or scam',
                    doc_count: 3386,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 3386
                        }
                      ]
                    }
                  },
                  {
                    key: 'Billing disputes',
                    doc_count: 3102,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 3102
                        }
                      ]
                    }
                  },
                  {
                    key: 'Can\'t repay my loan',
                    doc_count: 3057,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Can\'t decrease my monthly payments',
                          doc_count: 1557
                        },
                        {
                          key: 'Can\'t get flexible payment options',
                          doc_count: 999
                        },
                        {
                          key: 'Can\'t temporarily postpone payments',
                          doc_count: 501
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with fraud alerts or security freezes',
                    doc_count: 3049,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 3049
                        }
                      ]
                    }
                  },
                  {
                    key: 'Unable to get your credit report or credit score',
                    doc_count: 2944,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Other problem getting your report or credit score',
                          doc_count: 1733
                        },
                        {
                          key: 'Problem getting your free annual credit report',
                          doc_count: 1192
                        },
                        {
                          key: '',
                          doc_count: 19
                        }
                      ]
                    }
                  },
                  {
                    key: 'Taking/threatening an illegal action',
                    doc_count: 2934,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Threatened to sue on too old debt',
                          doc_count: 930
                        },
                        {
                          key: 'Threatened arrest/jail if do not pay',
                          doc_count: 712
                        },
                        {
                          key: 'Sued w/o proper notification of suit',
                          doc_count: 468
                        },
                        {
                          key: 'Seized/Attempted to seize property',
                          doc_count: 426
                        },
                        {
                          key: 'Attempted to/Collected exempt funds',
                          doc_count: 251
                        },
                        {
                          key: 'Sued where didn\'t live/sign for debt',
                          doc_count: 147
                        }
                      ]
                    }
                  },
                  {
                    key: 'Improper contact or sharing of info',
                    doc_count: 2911,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Talked to a third party about my debt',
                          doc_count: 1549
                        },
                        {
                          key: 'Contacted me after I asked not to',
                          doc_count: 694
                        },
                        {
                          key: 'Contacted employer after asked not to',
                          doc_count: 601
                        },
                        {
                          key: 'Contacted me instead of my attorney',
                          doc_count: 67
                        }
                      ]
                    }
                  },
                  {
                    key: 'Applying for a mortgage or refinancing an existing mortgage',
                    doc_count: 2834,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 2834
                        }
                      ]
                    }
                  },
                  {
                    key: 'Closing on a mortgage',
                    doc_count: 2519,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 2519
                        }
                      ]
                    }
                  },
                  {
                    key: 'Getting a credit card',
                    doc_count: 2479,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Card opened as result of identity theft or fraud',
                          doc_count: 1046
                        },
                        {
                          key: 'Application denied',
                          doc_count: 771
                        },
                        {
                          key: 'Sent card you never applied for',
                          doc_count: 322
                        },
                        {
                          key: 'Delay in processing application',
                          doc_count: 211
                        },
                        {
                          key: 'Problem getting a working replacement card',
                          doc_count: 129
                        }
                      ]
                    }
                  },
                  {
                    key: 'Struggling to pay your loan',
                    doc_count: 2471,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1006
                        },
                        {
                          key: 'Loan balance remaining after the vehicle is repossessed and sold',
                          doc_count: 529
                        },
                        {
                          key: 'Denied request to lower payments',
                          doc_count: 451
                        },
                        {
                          key: 'Lender trying to repossess or disable the vehicle',
                          doc_count: 432
                        },
                        {
                          key: 'Problem after you declared or threatened to declare bankruptcy',
                          doc_count: 53
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problems when you are unable to pay',
                    doc_count: 2456,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 2456
                        }
                      ]
                    }
                  },
                  {
                    key: 'Closing your account',
                    doc_count: 2337,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Company closed your account',
                          doc_count: 1746
                        },
                        {
                          key: 'Can\'t close your account',
                          doc_count: 591
                        }
                      ]
                    }
                  },
                  {
                    key: 'Advertising and marketing, including promotional offers',
                    doc_count: 2281,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Didn\'t receive advertised or promotional terms',
                          doc_count: 1375
                        },
                        {
                          key: 'Confusing or misleading advertising about the credit card',
                          doc_count: 906
                        }
                      ]
                    }
                  },
                  {
                    key: 'Closing an account',
                    doc_count: 2264,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Company closed your account',
                          doc_count: 977
                        },
                        {
                          key: 'Funds not received from closed account',
                          doc_count: 550
                        },
                        {
                          key: 'Can\'t close your account',
                          doc_count: 540
                        },
                        {
                          key: 'Fees charged for closing account',
                          doc_count: 197
                        }
                      ]
                    }
                  },
                  {
                    key: 'Unable to get credit report/credit score',
                    doc_count: 2252,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Problem getting my free annual report',
                          doc_count: 1214
                        },
                        {
                          key: 'Problem getting report or credit score',
                          doc_count: 1038
                        }
                      ]
                    }
                  },
                  {
                    key: 'Settlement process and costs',
                    doc_count: 2250,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 2250
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit monitoring or identity theft protection services',
                    doc_count: 2136,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Billing dispute for services',
                          doc_count: 832
                        },
                        {
                          key: 'Problem canceling credit monitoring or identify theft protection service',
                          doc_count: 453
                        },
                        {
                          key: 'Didn\'t receive services that were advertised',
                          doc_count: 373
                        },
                        {
                          key: 'Problem with product or service terms changing',
                          doc_count: 339
                        },
                        {
                          key: 'Received unwanted marketing or advertising',
                          doc_count: 118
                        },
                        {
                          key: '',
                          doc_count: 21
                        }
                      ]
                    }
                  },
                  {
                    key: 'Opening an account',
                    doc_count: 2110,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Didn\'t receive terms that were advertised',
                          doc_count: 1014
                        },
                        {
                          key: 'Unable to open an account',
                          doc_count: 635
                        },
                        {
                          key: 'Account opened as a result of fraud',
                          doc_count: 337
                        },
                        {
                          key: 'Confusing or missing disclosures',
                          doc_count: 124
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problems caused by my funds being low',
                    doc_count: 2084,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 2084
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with a lender or other company charging your account',
                    doc_count: 2033,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Transaction was not authorized',
                          doc_count: 1597
                        },
                        {
                          key: 'Money was taken from your account on the wrong day or for the wrong amount',
                          doc_count: 236
                        },
                        {
                          key: 'Can\'t stop withdrawals from your account',
                          doc_count: 200
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other',
                    doc_count: 1940,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1940
                        }
                      ]
                    }
                  },
                  {
                    key: 'Threatened to contact someone or share information improperly',
                    doc_count: 1912,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Talked to a third-party about your debt',
                          doc_count: 1000
                        },
                        {
                          key: 'Contacted your employer',
                          doc_count: 557
                        },
                        {
                          key: 'Contacted you after you asked them to stop',
                          doc_count: 324
                        },
                        {
                          key: 'Contacted you instead of your attorney',
                          doc_count: 31
                        }
                      ]
                    }
                  },
                  {
                    key: 'Identity theft / Fraud / Embezzlement',
                    doc_count: 1723,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1723
                        }
                      ]
                    }
                  },
                  {
                    key: 'Charged fees or interest you didn\'t expect',
                    doc_count: 1683,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1683
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem caused by your funds being low',
                    doc_count: 1653,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Overdrafts and overdraft fees',
                          doc_count: 1101
                        },
                        {
                          key: 'Non-sufficient funds and associated fees',
                          doc_count: 373
                        },
                        {
                          key: 'Bounced checks or returned payments',
                          doc_count: 107
                        },
                        {
                          key: 'Late or other fees',
                          doc_count: 72
                        }
                      ]
                    }
                  },
                  {
                    key: 'Using a debit or ATM card',
                    doc_count: 1597,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1597
                        }
                      ]
                    }
                  },
                  {
                    key: 'Money was not available when promised',
                    doc_count: 1591,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1591
                        }
                      ]
                    }
                  },
                  {
                    key: 'Taking out the loan or lease',
                    doc_count: 1560,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1560
                        }
                      ]
                    }
                  },
                  {
                    key: 'Improper use of my credit report',
                    doc_count: 1520,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Report improperly shared by CRC',
                          doc_count: 1415
                        },
                        {
                          key: 'Report shared with employer w/o consent',
                          doc_count: 53
                        },
                        {
                          key: 'Received marketing offer after opted out',
                          doc_count: 52
                        }
                      ]
                    }
                  },
                  {
                    key: 'Closing/Cancelling account',
                    doc_count: 1440,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1440
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problems at the end of the loan or lease',
                    doc_count: 1440,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Unable to receive car title or other problem after the loan is paid off',
                          doc_count: 426
                        },
                        {
                          key: 'Problem with paying off the loan',
                          doc_count: 363
                        },
                        {
                          key: 'Excess mileage, damage, or wear fees, or other problem after the lease is finish',
                          doc_count: 200
                        },
                        {
                          key: 'Problem while selling or giving up the vehicle',
                          doc_count: 156
                        },
                        {
                          key: 'Termination fees or other problem when ending the lease early',
                          doc_count: 134
                        },
                        {
                          key: 'Problem related to refinancing',
                          doc_count: 97
                        },
                        {
                          key: 'Problem when attempting to purchase vehicle at the end of the lease',
                          doc_count: 44
                        },
                        {
                          key: 'Problem extending the lease',
                          doc_count: 20
                        }
                      ]
                    }
                  },
                  {
                    key: 'Making/receiving payments, sending money',
                    doc_count: 1432,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1432
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other transaction problem',
                    doc_count: 1425,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1425
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit decision / Underwriting',
                    doc_count: 1289,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1289
                        }
                      ]
                    }
                  },
                  {
                    key: 'Trouble using your card',
                    doc_count: 1232,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Can\'t use card to make purchases',
                          doc_count: 788
                        },
                        {
                          key: 'Credit card company won\'t increase or decrease your credit limit',
                          doc_count: 429
                        },
                        {
                          key: 'Account sold or transferred to another company',
                          doc_count: 15
                        }
                      ]
                    }
                  },
                  {
                    key: 'Customer service / Customer relations',
                    doc_count: 973,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 973
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit monitoring or identity protection',
                    doc_count: 936,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Problem with fraud alerts',
                          doc_count: 292
                        },
                        {
                          key: 'Billing dispute',
                          doc_count: 278
                        },
                        {
                          key: 'Account terms and changes',
                          doc_count: 165
                        },
                        {
                          key: 'Problem cancelling or closing account',
                          doc_count: 148
                        },
                        {
                          key: 'Receiving unwanted marketing/advertising',
                          doc_count: 53
                        }
                      ]
                    }
                  },
                  {
                    key: 'Getting a loan or lease',
                    doc_count: 909,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Fraudulent loan',
                          doc_count: 371
                        },
                        {
                          key: 'Confusing or misleading advertising or marketing',
                          doc_count: 144
                        },
                        {
                          key: 'Changes in terms mid-deal or after closing',
                          doc_count: 128
                        },
                        {
                          key: 'Credit denial',
                          doc_count: 122
                        },
                        {
                          key: 'High-pressure sales tactics',
                          doc_count: 52
                        },
                        {
                          key: 'Problem with signing the paperwork',
                          doc_count: 31
                        },
                        {
                          key: 'Problem with additional add-on products or services purchased with the loan',
                          doc_count: 28
                        },
                        {
                          key: 'Problem with a trade-in',
                          doc_count: 19
                        },
                        {
                          key: 'Confusing or misleading advertising',
                          doc_count: 14
                        }
                      ]
                    }
                  },
                  {
                    key: 'Rewards',
                    doc_count: 900,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 900
                        }
                      ]
                    }
                  },
                  {
                    key: 'Charged fees or interest I didn\'t expect',
                    doc_count: 852,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 852
                        }
                      ]
                    }
                  },
                  {
                    key: 'Delinquent account',
                    doc_count: 834,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 834
                        }
                      ]
                    }
                  },
                  {
                    key: 'Advertising and marketing',
                    doc_count: 830,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 830
                        }
                      ]
                    }
                  },
                  {
                    key: 'APR or interest rate',
                    doc_count: 785,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 785
                        }
                      ]
                    }
                  },
                  {
                    key: 'Late fee',
                    doc_count: 771,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 771
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit card protection / Debt protection',
                    doc_count: 712,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 712
                        }
                      ]
                    }
                  },
                  {
                    key: 'Transaction issue',
                    doc_count: 681,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 681
                        }
                      ]
                    }
                  },
                  {
                    key: 'Unexpected or other fees',
                    doc_count: 680,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 680
                        }
                      ]
                    }
                  },
                  {
                    key: 'Shopping for a loan or lease',
                    doc_count: 662,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 662
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with a purchase or transfer',
                    doc_count: 645,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Card company isn\'t resolving a dispute about a purchase or transfer',
                          doc_count: 400
                        },
                        {
                          key: 'Charged for a purchase or transfer you did not make with the card',
                          doc_count: 232
                        },
                        {
                          key: 'Overcharged for a purchase or transfer you did make with the card',
                          doc_count: 13
                        }
                      ]
                    }
                  },
                  {
                    key: 'Billing statement',
                    doc_count: 620,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 620
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with the payoff process at the end of the loan',
                    doc_count: 605,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 605
                        }
                      ]
                    }
                  },
                  {
                    key: 'Unauthorized transactions/trans. issues',
                    doc_count: 543,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 543
                        }
                      ]
                    }
                  },
                  {
                    key: 'Struggling to pay your bill',
                    doc_count: 524,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Credit card company won\'t work with you while you\'re going through financial hardship',
                          doc_count: 461
                        },
                        {
                          key: 'Problem lowering your monthly payments',
                          doc_count: 35
                        },
                        {
                          key: 'Filed for bankruptcy',
                          doc_count: 28
                        }
                      ]
                    }
                  },
                  {
                    key: 'Unauthorized transactions or other transaction problem',
                    doc_count: 524,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 524
                        }
                      ]
                    }
                  },
                  {
                    key: 'Payoff process',
                    doc_count: 513,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 513
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit determination',
                    doc_count: 506,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 506
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other fee',
                    doc_count: 502,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 502
                        }
                      ]
                    }
                  },
                  {
                    key: 'Unsolicited issuance of credit card',
                    doc_count: 491,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 491
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other transaction issues',
                    doc_count: 471,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 471
                        }
                      ]
                    }
                  },
                  {
                    key: 'Getting a loan',
                    doc_count: 455,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Can\'t qualify for a loan',
                          doc_count: 127
                        },
                        {
                          key: 'Fraudulent loan',
                          doc_count: 127
                        },
                        {
                          key: 'Confusing or misleading advertising',
                          doc_count: 74
                        },
                        {
                          key: 'Qualify for a better loan than offered',
                          doc_count: 56
                        },
                        {
                          key: 'Denied loan',
                          doc_count: 33
                        },
                        {
                          key: 'Problem with the interest rate',
                          doc_count: 28
                        },
                        {
                          key: 'Qualified for a better loan than the one offered',
                          doc_count: 7
                        },
                        {
                          key: 'Problem with signing the paperwork',
                          doc_count: 3
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit line increase/decrease',
                    doc_count: 451,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 451
                        }
                      ]
                    }
                  },
                  {
                    key: 'Managing, opening, or closing your mobile wallet account',
                    doc_count: 442,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 442
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with a company\'s investigation into an existing issue',
                    doc_count: 424,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Their investigation did not fix an error on your report',
                          doc_count: 143
                        },
                        {
                          key: 'Difficulty submitting a dispute or getting information about a dispute over the phone',
                          doc_count: 119
                        },
                        {
                          key: 'Problem with personal statement of dispute',
                          doc_count: 69
                        },
                        {
                          key: 'Was not notified of investigation status or results',
                          doc_count: 65
                        },
                        {
                          key: 'Investigation took more than 30 days',
                          doc_count: 28
                        }
                      ]
                    }
                  },
                  {
                    key: 'Managing, opening, or closing account',
                    doc_count: 386,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 386
                        }
                      ]
                    }
                  },
                  {
                    key: 'Trouble using the card',
                    doc_count: 386,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Trouble using the card to spend money in a store or online',
                          doc_count: 195
                        },
                        {
                          key: 'Trouble getting information about the card',
                          doc_count: 55
                        },
                        {
                          key: 'Problem using the card to withdraw money from an ATM',
                          doc_count: 46
                        },
                        {
                          key: 'Problem with direct deposit',
                          doc_count: 46
                        },
                        {
                          key: 'Trouble using the card to pay a bill',
                          doc_count: 19
                        },
                        {
                          key: 'Problem adding money',
                          doc_count: 17
                        },
                        {
                          key: 'Problem with a check written from your prepaid card account',
                          doc_count: 6
                        },
                        {
                          key: 'Trouble using the card to send money to another person',
                          doc_count: 2
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other service problem',
                    doc_count: 385,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 385
                        }
                      ]
                    }
                  },
                  {
                    key: 'Can\'t contact lender',
                    doc_count: 372,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 372
                        }
                      ]
                    }
                  },
                  {
                    key: 'Getting the loan',
                    doc_count: 360,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 360
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with customer service',
                    doc_count: 305,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 305
                        }
                      ]
                    }
                  },
                  {
                    key: 'Balance transfer',
                    doc_count: 298,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 298
                        }
                      ]
                    }
                  },
                  {
                    key: 'Confusing or missing disclosures',
                    doc_count: 298,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 298
                        }
                      ]
                    }
                  },
                  {
                    key: 'Identity theft protection or other monitoring services',
                    doc_count: 263,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Didn\'t receive services that were advertised',
                          doc_count: 75
                        },
                        {
                          key: 'Problem canceling credit monitoring or identify theft protection service',
                          doc_count: 66
                        },
                        {
                          key: 'Problem with product or service terms changing',
                          doc_count: 52
                        },
                        {
                          key: 'Billing dispute for services',
                          doc_count: 40
                        },
                        {
                          key: 'Received unwanted marketing or advertising',
                          doc_count: 30
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem getting a card or closing an account',
                    doc_count: 255,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Trouble closing card',
                          doc_count: 125
                        },
                        {
                          key: 'Trouble getting, activating, or registering a card',
                          doc_count: 79
                        },
                        {
                          key: 'Trouble getting a working replacement card',
                          doc_count: 42
                        },
                        {
                          key: 'Don\'t want a card provided by your employer or the government',
                          doc_count: 9
                        }
                      ]
                    }
                  },
                  {
                    key: 'Wrong amount charged or received',
                    doc_count: 241,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 241
                        }
                      ]
                    }
                  },
                  {
                    key: 'Received a loan I didn\'t apply for',
                    doc_count: 210,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 210
                        }
                      ]
                    }
                  },
                  {
                    key: 'Applying for a mortgage',
                    doc_count: 184,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 184
                        }
                      ]
                    }
                  },
                  {
                    key: 'Confusing or misleading advertising or marketing',
                    doc_count: 178,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 178
                        }
                      ]
                    }
                  },
                  {
                    key: 'Getting a line of credit',
                    doc_count: 176,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 176
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with additional add-on products or services',
                    doc_count: 170,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 170
                        }
                      ]
                    }
                  },
                  {
                    key: 'Can\'t stop charges to bank account',
                    doc_count: 166,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 166
                        }
                      ]
                    }
                  },
                  {
                    key: 'Can\'t contact lender or servicer',
                    doc_count: 161,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 161
                        }
                      ]
                    }
                  },
                  {
                    key: 'Payment to acct not credited',
                    doc_count: 151,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 151
                        }
                      ]
                    }
                  },
                  {
                    key: 'Received a loan you didn\'t apply for',
                    doc_count: 151,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 151
                        }
                      ]
                    }
                  },
                  {
                    key: 'Can\'t stop withdrawals from your bank account',
                    doc_count: 144,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 144
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other service issues',
                    doc_count: 138,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 138
                        }
                      ]
                    }
                  },
                  {
                    key: 'Loan payment wasn\'t credited to your account',
                    doc_count: 130,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 130
                        }
                      ]
                    }
                  },
                  {
                    key: 'Application processing delay',
                    doc_count: 107,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 107
                        }
                      ]
                    }
                  },
                  {
                    key: 'Charged bank acct wrong day or amt',
                    doc_count: 106,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 106
                        }
                      ]
                    }
                  },
                  {
                    key: 'Privacy',
                    doc_count: 105,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 105
                        }
                      ]
                    }
                  },
                  {
                    key: 'Sale of account',
                    doc_count: 98,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 98
                        }
                      ]
                    }
                  },
                  {
                    key: 'Bankruptcy',
                    doc_count: 96,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 96
                        }
                      ]
                    }
                  },
                  {
                    key: 'Vehicle was repossessed or sold the vehicle',
                    doc_count: 93,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 93
                        }
                      ]
                    }
                  },
                  {
                    key: 'Adding money',
                    doc_count: 92,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 92
                        }
                      ]
                    }
                  },
                  {
                    key: 'Applied for loan/did not receive money',
                    doc_count: 85,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 85
                        }
                      ]
                    }
                  },
                  {
                    key: 'Forbearance / Workout plans',
                    doc_count: 85,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 85
                        }
                      ]
                    }
                  },
                  {
                    key: 'Money was taken from your bank account on the wrong day or for the wrong amount',
                    doc_count: 85,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 85
                        }
                      ]
                    }
                  },
                  {
                    key: 'Arbitration',
                    doc_count: 83,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 83
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem adding money',
                    doc_count: 83,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 83
                        }
                      ]
                    }
                  },
                  {
                    key: 'Excessive fees',
                    doc_count: 78,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 78
                        }
                      ]
                    }
                  },
                  {
                    key: 'Fees',
                    doc_count: 77,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 77
                        }
                      ]
                    }
                  },
                  {
                    key: 'Advertising',
                    doc_count: 72,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Confusing or misleading advertising about the card',
                          doc_count: 57
                        },
                        {
                          key: 'Changes in terms from what was offered or advertised',
                          doc_count: 15
                        }
                      ]
                    }
                  },
                  {
                    key: 'Was approved for a loan, but didn\'t receive the money',
                    doc_count: 62,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 62
                        }
                      ]
                    }
                  },
                  {
                    key: 'Lost or stolen check',
                    doc_count: 60,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 60
                        }
                      ]
                    }
                  },
                  {
                    key: 'Incorrect/missing disclosures or info',
                    doc_count: 58,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 58
                        }
                      ]
                    }
                  },
                  {
                    key: 'Customer service/Customer relations',
                    doc_count: 55,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 55
                        }
                      ]
                    }
                  },
                  {
                    key: 'Lost or stolen money order',
                    doc_count: 54,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 54
                        }
                      ]
                    }
                  },
                  {
                    key: 'Balance transfer fee',
                    doc_count: 51,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 51
                        }
                      ]
                    }
                  },
                  {
                    key: 'Cash advance',
                    doc_count: 44,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 44
                        }
                      ]
                    }
                  },
                  {
                    key: 'Cash advance fee',
                    doc_count: 41,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 41
                        }
                      ]
                    }
                  },
                  {
                    key: 'Convenience checks',
                    doc_count: 37,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 37
                        }
                      ]
                    }
                  },
                  {
                    key: 'Vehicle was damaged or destroyed the vehicle',
                    doc_count: 34,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 34
                        }
                      ]
                    }
                  },
                  {
                    key: 'Lender repossessed or sold the vehicle',
                    doc_count: 31,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 31
                        }
                      ]
                    }
                  },
                  {
                    key: 'Overlimit fee',
                    doc_count: 31,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 31
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit limit changed',
                    doc_count: 30,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 30
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with cash advance',
                    doc_count: 27,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 27
                        }
                      ]
                    }
                  },
                  {
                    key: 'Incorrect exchange rate',
                    doc_count: 26,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 26
                        }
                      ]
                    }
                  },
                  {
                    key: 'Advertising, marketing or disclosures',
                    doc_count: 25,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 25
                        }
                      ]
                    }
                  },
                  {
                    key: 'Unexpected/Other fees',
                    doc_count: 22,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 22
                        }
                      ]
                    }
                  },
                  {
                    key: 'Account terms and changes',
                    doc_count: 17,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 17
                        }
                      ]
                    }
                  },
                  {
                    key: 'Overdraft, savings or rewards features',
                    doc_count: 17,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 17
                        }
                      ]
                    }
                  },
                  {
                    key: 'Managing the line of credit',
                    doc_count: 16,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 16
                        }
                      ]
                    }
                  },
                  {
                    key: 'Was approved for a loan, but didn\'t receive money',
                    doc_count: 15,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 15
                        }
                      ]
                    }
                  },
                  {
                    key: 'Disclosures',
                    doc_count: 13,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 13
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with overdraft',
                    doc_count: 13,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Overdraft charges',
                          doc_count: 12
                        },
                        {
                          key: 'Was signed up for overdraft on card, but don\'t want to be',
                          doc_count: 1
                        }
                      ]
                    }
                  },
                  {
                    key: 'Overdraft, savings, or rewards features',
                    doc_count: 11,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 11
                        }
                      ]
                    }
                  },
                  {
                    key: 'Shopping for a line of credit',
                    doc_count: 10,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 10
                        }
                      ]
                    }
                  },
                  {
                    key: 'Lender sold the property',
                    doc_count: 3,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 3
                        }
                      ]
                    }
                  },
                  {
                    key: 'Property was sold',
                    doc_count: 3,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 3
                        }
                      ]
                    }
                  },
                  {
                    key: 'Lender damaged or destroyed vehicle',
                    doc_count: 2,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 2
                        }
                      ]
                    }
                  },
                  {
                    key: 'Problem with an overdraft',
                    doc_count: 2,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Was signed up for overdraft on card, but don\'t want to be',
                          doc_count: 2
                        }
                      ]
                    }
                  },
                  {
                    key: 'Property was damaged or destroyed property',
                    doc_count: 2,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 2
                        }
                      ]
                    }
                  },
                  {
                    key: 'Lender damaged or destroyed property',
                    doc_count: 1,
                    'sub_issue.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1
                        }
                      ]
                    }
                  }
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
                    doc_count: 134170,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Credit reporting',
                          doc_count: 131101
                        },
                        {
                          key: 'Other personal consumer report',
                          doc_count: 2376
                        },
                        {
                          key: 'Credit repair services',
                          doc_count: 692
                        },
                        {
                          key: 'Conventional home mortgage',
                          doc_count: 1
                        }
                      ]
                    }
                  },
                  {
                    key: 'Debt collection',
                    doc_count: 102661,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'I do not know',
                          doc_count: 19897
                        },
                        {
                          key: 'Other debt',
                          doc_count: 17942
                        },
                        {
                          key: 'Credit card debt',
                          doc_count: 13786
                        },
                        {
                          key: 'Other (i.e. phone, health club, etc.)',
                          doc_count: 12389
                        },
                        {
                          key: 'Medical debt',
                          doc_count: 10730
                        },
                        {
                          key: 'Credit card',
                          doc_count: 7520
                        },
                        {
                          key: 'Medical',
                          doc_count: 6990
                        },
                        {
                          key: 'Payday loan debt',
                          doc_count: 2362
                        },
                        {
                          key: 'Auto debt',
                          doc_count: 2202
                        },
                        {
                          key: 'Payday loan',
                          doc_count: 2064
                        },
                        {
                          key: 'Mortgage debt',
                          doc_count: 1448
                        },
                        {
                          key: 'Federal student loan debt',
                          doc_count: 1081
                        },
                        {
                          key: 'Auto',
                          doc_count: 1064
                        },
                        {
                          key: 'Private student loan debt',
                          doc_count: 1046
                        },
                        {
                          key: 'Mortgage',
                          doc_count: 907
                        },
                        {
                          key: 'Non-federal student loan',
                          doc_count: 684
                        },
                        {
                          key: 'Federal student loan',
                          doc_count: 549
                        }
                      ]
                    }
                  },
                  {
                    key: 'Mortgage',
                    doc_count: 59784,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Conventional home mortgage',
                          doc_count: 16248
                        },
                        {
                          key: 'Conventional fixed mortgage',
                          doc_count: 14562
                        },
                        {
                          key: 'FHA mortgage',
                          doc_count: 11073
                        },
                        {
                          key: 'Conventional adjustable mortgage (ARM)',
                          doc_count: 4975
                        },
                        {
                          key: 'VA mortgage',
                          doc_count: 3353
                        },
                        {
                          key: 'Other mortgage',
                          doc_count: 3236
                        },
                        {
                          key: 'Home equity loan or line of credit',
                          doc_count: 2103
                        },
                        {
                          key: 'Other type of mortgage',
                          doc_count: 1943
                        },
                        {
                          key: 'Home equity loan or line of credit (HELOC)',
                          doc_count: 1623
                        },
                        {
                          key: 'Reverse mortgage',
                          doc_count: 668
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit reporting',
                    doc_count: 31588,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 31588
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit card or prepaid card',
                    doc_count: 29772,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'General-purpose credit card or charge card',
                          doc_count: 22648
                        },
                        {
                          key: 'Store credit card',
                          doc_count: 5358
                        },
                        {
                          key: 'General-purpose prepaid card',
                          doc_count: 1205
                        },
                        {
                          key: 'Government benefit card',
                          doc_count: 301
                        },
                        {
                          key: 'Gift card',
                          doc_count: 134
                        },
                        {
                          key: 'Payroll card',
                          doc_count: 123
                        },
                        {
                          key: 'Student prepaid card',
                          doc_count: 3
                        }
                      ]
                    }
                  },
                  {
                    key: 'Student loan',
                    doc_count: 24425,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Federal student loan servicing',
                          doc_count: 13950
                        },
                        {
                          key: 'Non-federal student loan',
                          doc_count: 5753
                        },
                        {
                          key: 'Private student loan',
                          doc_count: 4722
                        }
                      ]
                    }
                  },
                  {
                    key: 'Credit card',
                    doc_count: 18838,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 18838
                        }
                      ]
                    }
                  },
                  {
                    key: 'Checking or savings account',
                    doc_count: 17885,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Checking account',
                          doc_count: 14863
                        },
                        {
                          key: 'Other banking product or service',
                          doc_count: 1425
                        },
                        {
                          key: 'Savings account',
                          doc_count: 1258
                        },
                        {
                          key: 'CD (Certificate of Deposit)',
                          doc_count: 326
                        },
                        {
                          key: 'Personal line of credit',
                          doc_count: 13
                        }
                      ]
                    }
                  },
                  {
                    key: 'Bank account or service',
                    doc_count: 14885,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Checking account',
                          doc_count: 10113
                        },
                        {
                          key: 'Other bank product/service',
                          doc_count: 3477
                        },
                        {
                          key: 'Savings account',
                          doc_count: 887
                        },
                        {
                          key: '(CD) Certificate of deposit',
                          doc_count: 274
                        },
                        {
                          key: 'Cashing a check without an account',
                          doc_count: 134
                        }
                      ]
                    }
                  },
                  {
                    key: 'Consumer Loan',
                    doc_count: 9473,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Vehicle loan',
                          doc_count: 5141
                        },
                        {
                          key: 'Installment loan',
                          doc_count: 3093
                        },
                        {
                          key: 'Vehicle lease',
                          doc_count: 962
                        },
                        {
                          key: 'Title loan',
                          doc_count: 199
                        },
                        {
                          key: 'Personal line of credit',
                          doc_count: 44
                        },
                        {
                          key: 'Pawn loan',
                          doc_count: 34
                        }
                      ]
                    }
                  },
                  {
                    key: 'Vehicle loan or lease',
                    doc_count: 7700,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Loan',
                          doc_count: 6310
                        },
                        {
                          key: 'Lease',
                          doc_count: 1382
                        },
                        {
                          key: 'Title loan',
                          doc_count: 8
                        }
                      ]
                    }
                  },
                  {
                    key: 'Money transfer, virtual currency, or money service',
                    doc_count: 7336,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Domestic (US) money transfer',
                          doc_count: 2206
                        },
                        {
                          key: 'Mobile or digital wallet',
                          doc_count: 1836
                        },
                        {
                          key: 'Virtual currency',
                          doc_count: 1612
                        },
                        {
                          key: 'International money transfer',
                          doc_count: 1035
                        },
                        {
                          key: 'Traveler\'s check or cashier\'s check',
                          doc_count: 139
                        },
                        {
                          key: 'Money order',
                          doc_count: 130
                        },
                        {
                          key: 'Check cashing service',
                          doc_count: 128
                        },
                        {
                          key: 'Debt settlement',
                          doc_count: 90
                        },
                        {
                          key: 'Foreign currency exchange',
                          doc_count: 90
                        },
                        {
                          key: 'Refund anticipation check',
                          doc_count: 70
                        }
                      ]
                    }
                  },
                  {
                    key: 'Payday loan, title loan, or personal loan',
                    doc_count: 5954,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Installment loan',
                          doc_count: 2412
                        },
                        {
                          key: 'Payday loan',
                          doc_count: 1891
                        },
                        {
                          key: 'Personal line of credit',
                          doc_count: 1016
                        },
                        {
                          key: 'Title loan',
                          doc_count: 621
                        },
                        {
                          key: 'Pawn loan',
                          doc_count: 14
                        }
                      ]
                    }
                  },
                  {
                    key: 'Payday loan',
                    doc_count: 1746,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: '',
                          doc_count: 1746
                        }
                      ]
                    }
                  },
                  {
                    key: 'Money transfers',
                    doc_count: 1497,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Domestic (US) money transfer',
                          doc_count: 861
                        },
                        {
                          key: 'International money transfer',
                          doc_count: 636
                        }
                      ]
                    }
                  },
                  {
                    key: 'Prepaid card',
                    doc_count: 1450,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'General purpose card',
                          doc_count: 730
                        },
                        {
                          key: 'Payroll card',
                          doc_count: 220
                        },
                        {
                          key: 'Gift or merchant card',
                          doc_count: 154
                        },
                        {
                          key: 'ID prepaid card',
                          doc_count: 101
                        },
                        {
                          key: 'Mobile wallet',
                          doc_count: 85
                        },
                        {
                          key: 'Government benefit payment card',
                          doc_count: 80
                        },
                        {
                          key: 'Other special purpose card',
                          doc_count: 58
                        },
                        {
                          key: 'Transit card',
                          doc_count: 19
                        },
                        {
                          key: 'Electronic Benefit Transfer / EBT card',
                          doc_count: 3
                        }
                      ]
                    }
                  },
                  {
                    key: 'Other financial service',
                    doc_count: 292,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Debt settlement',
                          doc_count: 109
                        },
                        {
                          key: 'Check cashing',
                          doc_count: 54
                        },
                        {
                          key: 'Credit repair',
                          doc_count: 39
                        },
                        {
                          key: 'Money order',
                          doc_count: 35
                        },
                        {
                          key: 'Traveler’s/Cashier’s checks',
                          doc_count: 22
                        },
                        {
                          key: 'Refund anticipation check',
                          doc_count: 17
                        },
                        {
                          key: 'Foreign currency exchange',
                          doc_count: 16
                        }
                      ]
                    }
                  },
                  {
                    key: 'Virtual currency',
                    doc_count: 16,
                    'sub_product.raw': {
                      doc_count_error_upper_bound: 0,
                      sum_other_doc_count: 0,
                      buckets: [
                        {
                          key: 'Domestic (US) money transfer',
                          doc_count: 15
                        },
                        {
                          key: 'International money transfer',
                          doc_count: 1
                        }
                      ]
                    }
                  }
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
      console.log(JSON.stringify(result))
      expect( result ).toEqual( {
        "state": [ {
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
        "issue": [ {
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
        }, {
          "name": "Trouble during payment process",
          "value": 12599,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "3.00",
          "width": 0.5
        }, {
          "name": "Written notification about debt",
          "value": 11873,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "3.00",
          "width": 0.5
        }, {
          "name": "Loan modification,collection,foreclosure",
          "value": 10789,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "False statements or representation",
          "value": 10208,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Managing an account",
          "value": 9696,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Dealing with your lender or servicer",
          "value": 8815,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Struggling to pay mortgage",
          "value": 8095,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Dealing with my lender or servicer",
          "value": 7909,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Disclosure verification of debt",
          "value": 7590,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Managing the loan or lease",
          "value": 7378,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Took or threatened to take negative or legal action",
          "value": 7353,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Problem with a purchase shown on your statement",
          "value": 6581,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Account opening, closing, or management",
          "value": 6347,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Credit reporting company's investigation",
          "value": 5663,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Other features, terms, or problems",
          "value": 4221,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Fees or interest",
          "value": 4011,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Application, originator, mortgage broker",
          "value": 3746,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Problem when making payments",
          "value": 3703,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Deposits and withdrawals",
          "value": 3425,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Struggling to repay your loan",
          "value": 3405,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Fraud or scam",
          "value": 3386,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Billing disputes",
          "value": 3102,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Can't repay my loan",
          "value": 3057,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Problem with fraud alerts or security freezes",
          "value": 3049,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Unable to get your credit report or credit score",
          "value": 2944,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Taking/threatening an illegal action",
          "value": 2934,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Improper contact or sharing of info",
          "value": 2911,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Applying for a mortgage or refinancing an existing mortgage",
          "value": 2834,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Closing on a mortgage",
          "value": 2519,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Getting a credit card",
          "value": 2479,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Struggling to pay your loan",
          "value": 2471,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Problems when you are unable to pay",
          "value": 2456,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Closing your account",
          "value": 2337,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Advertising and marketing, including promotional offers",
          "value": 2281,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Closing an account",
          "value": 2264,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Unable to get credit report/credit score",
          "value": 2252,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Settlement process and costs",
          "value": 2250,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Credit monitoring or identity theft protection services",
          "value": 2136,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Opening an account",
          "value": 2110,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problems caused by my funds being low",
          "value": 2084,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with a lender or other company charging your account",
          "value": 2033,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Other",
          "value": 1940,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Threatened to contact someone or share information improperly",
          "value": 1912,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Identity theft / Fraud / Embezzlement",
          "value": 1723,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Charged fees or interest you didn't expect",
          "value": 1683,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem caused by your funds being low",
          "value": 1653,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Using a debit or ATM card",
          "value": 1597,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Money was not available when promised",
          "value": 1591,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Taking out the loan or lease",
          "value": 1560,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Improper use of my credit report",
          "value": 1520,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Closing/Cancelling account",
          "value": 1440,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problems at the end of the loan or lease",
          "value": 1440,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Making/receiving payments, sending money",
          "value": 1432,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Other transaction problem",
          "value": 1425,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Credit decision / Underwriting",
          "value": 1289,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Trouble using your card",
          "value": 1232,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Customer service / Customer relations",
          "value": 973,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Credit monitoring or identity protection",
          "value": 936,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Getting a loan or lease",
          "value": 909,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Rewards",
          "value": 900,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Charged fees or interest I didn't expect",
          "value": 852,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Delinquent account",
          "value": 834,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Advertising and marketing",
          "value": 830,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "APR or interest rate",
          "value": 785,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Late fee",
          "value": 771,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Credit card protection / Debt protection",
          "value": 712,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Transaction issue",
          "value": 681,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Unexpected or other fees",
          "value": 680,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Shopping for a loan or lease",
          "value": 662,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with a purchase or transfer",
          "value": 645,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Billing statement",
          "value": 620,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with the payoff process at the end of the loan",
          "value": 605,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Unauthorized transactions/trans. issues",
          "value": 543,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Struggling to pay your bill",
          "value": 524,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Unauthorized transactions or other transaction problem",
          "value": 524,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Payoff process",
          "value": 513,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Credit determination",
          "value": 506,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Other fee",
          "value": 502,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Unsolicited issuance of credit card",
          "value": 491,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Other transaction issues",
          "value": 471,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Getting a loan",
          "value": 455,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Credit line increase/decrease",
          "value": 451,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Managing, opening, or closing your mobile wallet account",
          "value": 442,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with a company's investigation into an existing issue",
          "value": 424,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Managing, opening, or closing account",
          "value": 386,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Trouble using the card",
          "value": 386,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Other service problem",
          "value": 385,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Can't contact lender",
          "value": 372,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Getting the loan",
          "value": 360,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with customer service",
          "value": 305,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Balance transfer",
          "value": 298,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Confusing or missing disclosures",
          "value": 298,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Identity theft protection or other monitoring services",
          "value": 263,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem getting a card or closing an account",
          "value": 255,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Wrong amount charged or received",
          "value": 241,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Received a loan I didn't apply for",
          "value": 210,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Applying for a mortgage",
          "value": 184,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Confusing or misleading advertising or marketing",
          "value": 178,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Getting a line of credit",
          "value": 176,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with additional add-on products or services",
          "value": 170,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Can't stop charges to bank account",
          "value": 166,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Can't contact lender or servicer",
          "value": 161,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Payment to acct not credited",
          "value": 151,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Received a loan you didn't apply for",
          "value": 151,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Can't stop withdrawals from your bank account",
          "value": 144,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Other service issues",
          "value": 138,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Loan payment wasn't credited to your account",
          "value": 130,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Application processing delay",
          "value": 107,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Charged bank acct wrong day or amt",
          "value": 106,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Privacy",
          "value": 105,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Sale of account",
          "value": 98,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Bankruptcy",
          "value": 96,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Vehicle was repossessed or sold the vehicle",
          "value": 93,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Adding money",
          "value": 92,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Applied for loan/did not receive money",
          "value": 85,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Forbearance / Workout plans",
          "value": 85,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Money was taken from your bank account on the wrong day or for the wrong amount",
          "value": 85,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Arbitration",
          "value": 83,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem adding money",
          "value": 83,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Excessive fees",
          "value": 78,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Fees",
          "value": 77,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Advertising",
          "value": 72,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Was approved for a loan, but didn't receive the money",
          "value": 62,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Lost or stolen check",
          "value": 60,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Incorrect/missing disclosures or info",
          "value": 58,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Customer service/Customer relations",
          "value": 55,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Lost or stolen money order",
          "value": 54,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Balance transfer fee",
          "value": 51,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Cash advance",
          "value": 44,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Cash advance fee",
          "value": 41,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Convenience checks",
          "value": 37,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Vehicle was damaged or destroyed the vehicle",
          "value": 34,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Lender repossessed or sold the vehicle",
          "value": 31,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Overlimit fee",
          "value": 31,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Credit limit changed",
          "value": 30,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with cash advance",
          "value": 27,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Incorrect exchange rate",
          "value": 26,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Advertising, marketing or disclosures",
          "value": 25,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Unexpected/Other fees",
          "value": 22,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Account terms and changes",
          "value": 17,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Overdraft, savings or rewards features",
          "value": 17,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Managing the line of credit",
          "value": 16,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Was approved for a loan, but didn't receive money",
          "value": 15,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Disclosures",
          "value": 13,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with overdraft",
          "value": 13,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Overdraft, savings, or rewards features",
          "value": 11,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Shopping for a line of credit",
          "value": 10,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Lender sold the property",
          "value": 3,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Property was sold",
          "value": 3,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Lender damaged or destroyed vehicle",
          "value": 2,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Problem with an overdraft",
          "value": 2,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Property was damaged or destroyed property",
          "value": 2,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Lender damaged or destroyed property",
          "value": 1,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        } ],
        "product": [ {
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
        }, {
          "name": "Bank account or service",
          "value": 14885,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "3.00",
          "width": 0.5
        }, {
          "name": "Consumer Loan",
          "value": 9473,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Vehicle loan or lease",
          "value": 7700,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Money transfer, virtual currency, or money service",
          "value": 7336,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "2.00",
          "width": 0.5
        }, {
          "name": "Payday loan, title loan, or personal loan",
          "value": 5954,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "1.00",
          "width": 0.5
        }, {
          "name": "Payday loan",
          "value": 1746,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Money transfers",
          "value": 1497,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Prepaid card",
          "value": 1450,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Other financial service",
          "value": 292,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        }, {
          "name": "Virtual currency",
          "value": 16,
          "pctChange": 1,
          "isParent": true,
          "hasChildren": false,
          "pctOfSet": "0.00",
          "width": 0.5
        } ]
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
