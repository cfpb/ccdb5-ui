export const trendsAggs = {
  dateRangeBrush: {
    doc_count: 532,
    dateRangeBrush: {
      buckets: [
        {
          key_as_string: '2020-03-01T00:00:00.000Z',
          key: 1583020800000,
          doc_count: 106,
        },
        {
          key_as_string: '2020-04-01T00:00:00.000Z',
          key: 1585699200000,
          doc_count: 374,
        },
        {
          key_as_string: '2020-05-01T00:00:00.000Z',
          key: 1588291200000,
          doc_count: 52,
        },
      ],
    },
  },
  product: {
    doc_count: 532,
    product: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 50,
      buckets: [
        {
          key: 'Mortgage',
          doc_count: 185,
          product: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Conventional home mortgage',
                doc_count: 108,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 72,
                      interval_diff: { value: 47 },
                    },
                  ],
                },
              },
              {
                key: 'FHA mortgage',
                doc_count: 44,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 36,
                      interval_diff: { value: 31 },
                    },
                  ],
                },
              },
              {
                key: 'VA mortgage',
                doc_count: 19,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 14,
                      interval_diff: { value: 11 },
                    },
                  ],
                },
              },
              {
                key: 'Other type of mortgage',
                doc_count: 9,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 4,
                      interval_diff: { value: 2 },
                    },
                  ],
                },
              },
              {
                key: 'Home equity loan or line of credit (HELOC)',
                doc_count: 5,
                trend_period: { buckets: [] },
              },
            ],
          },
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 19,
                interval_diff: { value: -112 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 131,
                interval_diff: { value: 96 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 35,
              },
            ],
          },
        },
        {
          key: 'Credit card or prepaid card',
          doc_count: 129,
          product: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'General-purpose credit card or charge card',
                doc_count: 98,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 68,
                      interval_diff: { value: 46 },
                    },
                  ],
                },
              },
              {
                key: 'Store credit card',
                doc_count: 23,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 17,
                      interval_diff: { value: 12 },
                    },
                  ],
                },
              },
              {
                key: 'Government benefit card',
                doc_count: 6,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 5,
                    },
                  ],
                },
              },
              {
                key: 'General-purpose prepaid card',
                doc_count: 2,
                trend_period: { buckets: [] },
              },
            ],
          },
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 12,
                interval_diff: { value: -78 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 90,
                interval_diff: { value: 63 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 27,
              },
            ],
          },
        },
        {
          key: 'Credit reporting, credit repair services, or other personal consumer reports',
          doc_count: 87,
          product: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Credit reporting',
                doc_count: 84,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 62,
                      interval_diff: { value: 48 },
                    },
                  ],
                },
              },
              {
                key: 'Credit repair services',
                doc_count: 2,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 1,
                    },
                  ],
                },
              },
              {
                key: 'Other personal consumer report',
                doc_count: 1,
                trend_period: { buckets: [] },
              },
            ],
          },
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 9,
                interval_diff: { value: -55 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 64,
                interval_diff: { value: 50 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 14,
              },
            ],
          },
        },
        {
          key: 'Checking or savings account',
          doc_count: 43,
          product: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Checking account',
                doc_count: 34,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 27,
                      interval_diff: { value: 24 },
                    },
                  ],
                },
              },
              {
                key: 'Savings account',
                doc_count: 5,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 2,
                    },
                  ],
                },
              },
              {
                key: 'Other banking product or service',
                doc_count: 3,
                trend_period: { buckets: [] },
              },
              {
                key: 'CD (Certificate of Deposit)',
                doc_count: 1,
                trend_period: { buckets: [] },
              },
            ],
          },
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 4,
                interval_diff: { value: -30 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 34,
                interval_diff: { value: 29 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 5,
              },
            ],
          },
        },
        {
          key: 'Debt collection',
          doc_count: 38,
          product: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Other debt',
                doc_count: 12,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 6,
                      interval_diff: { value: 3 },
                    },
                  ],
                },
              },
              {
                key: 'I do not know',
                doc_count: 8,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 5,
                    },
                  ],
                },
              },
              {
                key: 'Medical debt',
                doc_count: 8,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 1,
                    },
                  ],
                },
              },
              {
                key: 'Auto debt',
                doc_count: 4,
                trend_period: { buckets: [] },
              },
              {
                key: 'Credit card debt',
                doc_count: 4,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 2,
                      interval_diff: { value: 1 },
                    },
                  ],
                },
              },
              {
                key: 'Federal student loan debt',
                doc_count: 1,
                trend_period: { buckets: [] },
              },
              {
                key: 'Private student loan debt',
                doc_count: 1,
                trend_period: { buckets: [] },
              },
            ],
          },
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 4,
                interval_diff: { value: -20 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 24,
                interval_diff: { value: 14 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 10,
              },
            ],
          },
        },
      ],
    },
  },
  max_date: {
    value: 1589216400000,
    value_as_string: '2020-05-11T12:00:00-05:00',
  },
  issue: {
    doc_count: 532,
    issue: {
      doc_count_error_upper_bound: 5,
      sum_other_doc_count: 257,
      buckets: [
        {
          key: 'Struggling to pay mortgage',
          doc_count: 116,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 8,
                interval_diff: { value: -75 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 83,
                interval_diff: { value: 58 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 25,
              },
            ],
          },
          issue: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [],
          },
        },
        {
          key: 'Incorrect information on your report',
          doc_count: 54,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 5,
                interval_diff: { value: -40 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 45,
                interval_diff: { value: 41 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 4,
              },
            ],
          },
          issue: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Account status incorrect',
                doc_count: 16,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 15,
                    },
                  ],
                },
              },
              {
                key: 'Account information incorrect',
                doc_count: 14,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 2,
                    },
                  ],
                },
              },
              {
                key: 'Information belongs to someone else',
                doc_count: 13,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 11,
                    },
                  ],
                },
              },
              {
                key: 'Old information reappears or never goes away',
                doc_count: 4,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 2,
                    },
                  ],
                },
              },
              {
                key: 'Personal information incorrect',
                doc_count: 2,
                trend_period: { buckets: [] },
              },
              {
                key: 'Information is missing that should be on the report',
                doc_count: 1,
                trend_period: { buckets: [] },
              },
              {
                key: 'Public record information inaccurate',
                doc_count: 1,
                trend_period: { buckets: [] },
              },
            ],
          },
        },
        {
          key: 'Trouble during payment process',
          doc_count: 49,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 6,
                interval_diff: { value: -29 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 35,
                interval_diff: { value: 27 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 8,
              },
            ],
          },
          issue: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [],
          },
        },
        {
          key: 'Managing an account',
          doc_count: 29,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 2,
                interval_diff: { value: -22 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 24,
                interval_diff: { value: 21 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 3,
              },
            ],
          },
          issue: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Deposits and withdrawals',
                doc_count: 10,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 7,
                      interval_diff: { value: 5 },
                    },
                  ],
                },
              },
              {
                key: 'Problem using a debit or ATM card',
                doc_count: 7,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 1,
                    },
                  ],
                },
              },
              {
                key: 'Funds not handled or disbursed as instructed',
                doc_count: 4,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-04-01T00:00:00.000Z',
                      key: 1585699200000,
                      doc_count: 3,
                    },
                  ],
                },
              },
              {
                key: 'Fee problem',
                doc_count: 3,
                trend_period: { buckets: [] },
              },
              {
                key: 'Problem accessing account',
                doc_count: 2,
                trend_period: { buckets: [] },
              },
              {
                key: 'Problem making or receiving payments',
                doc_count: 2,
                trend_period: { buckets: [] },
              },
              {
                key: 'Cashing a check',
                doc_count: 1,
                trend_period: { buckets: [] },
              },
            ],
          },
        },
        {
          key: 'Fees or interest',
          doc_count: 27,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 20,
                interval_diff: { value: 13 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 7,
              },
            ],
          },
          issue: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Problem with fees',
                doc_count: 17,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 4,
                    },
                  ],
                },
              },
              {
                key: 'Charged too much interest',
                doc_count: 6,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 2,
                    },
                  ],
                },
              },
              {
                key: 'Unexpected increase in interest rate',
                doc_count: 4,
                trend_period: {
                  buckets: [
                    {
                      key_as_string: '2020-03-01T00:00:00.000Z',
                      key: 1583020800000,
                      doc_count: 1,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  min_date: {
    value: 1584032400000,
    value_as_string: '2020-03-12T12:00:00-05:00',
  },
  dateRangeArea: {
    doc_count: 532,
    dateRangeArea: {
      buckets: [
        {
          key_as_string: '2020-03-01T00:00:00.000Z',
          key: 1583020800000,
          doc_count: 106,
        },
        {
          key_as_string: '2020-04-01T00:00:00.000Z',
          key: 1585699200000,
          doc_count: 374,
        },
        {
          key_as_string: '2020-05-01T00:00:00.000Z',
          key: 1588291200000,
          doc_count: 52,
        },
      ],
    },
  },
  tags: {
    doc_count: 532,
    tags: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'Servicemember',
          doc_count: 70,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 7,
                interval_diff: { value: -43 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 50,
                interval_diff: { value: 37 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 13,
              },
            ],
          },
        },
        {
          key: 'Older American',
          doc_count: 30,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 1,
                interval_diff: { value: -21 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 22,
                interval_diff: { value: 15 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 7,
              },
            ],
          },
        },
        {
          key: 'Older American, Servicemember',
          doc_count: 7,
          trend_period: {
            buckets: [
              {
                key_as_string: '2020-05-01T00:00:00.000Z',
                key: 1588291200000,
                doc_count: 1,
                interval_diff: { value: -4 },
              },
              {
                key_as_string: '2020-04-01T00:00:00.000Z',
                key: 1585699200000,
                doc_count: 5,
                interval_diff: { value: 4 },
              },
              {
                key_as_string: '2020-03-01T00:00:00.000Z',
                key: 1583020800000,
                doc_count: 1,
              },
            ],
          },
        },
      ],
    },
  },
  dateRangeBuckets: {
    doc_count: 121054,
    dateRangeBuckets: {
      buckets: [
        {
          key_as_string: '2020-01-01T00:00:00.000Z',
          key: 1577836800000,
          doc_count: 21519,
        },
        {
          key_as_string: '2020-02-01T00:00:00.000Z',
          key: 1580515200000,
          doc_count: 25096,
        },
        {
          key_as_string: '2020-03-01T00:00:00.000Z',
          key: 1583020800000,
          doc_count: 29506,
        },
        {
          key_as_string: '2020-04-01T00:00:00.000Z',
          key: 1585699200000,
          doc_count: 35112,
        },
        {
          key_as_string: '2020-05-01T00:00:00.000Z',
          key: 1588291200000,
          doc_count: 9821,
        },
      ],
    },
  },
};
export const trendsResults = {
  chartType: 'line',
  colorMap: {
    Complaints: '#20aa3f',
    Other: '#a2a3a4',
    'All other products': '#a2a3a4',
    'All other companies': '#a2a3a4',
    'All other values': '#a2a3a4',
  },
  error: false,
  focus: '',
  lens: 'Overview',
  results: {
    dateRangeArea: [],
    dateRangeLine: {
      dataByTopic: [
        {
          topic: 'Complaints',
          topicName: 'Complaints',
          dashed: false,
          show: true,
          dates: [
            { date: '2020-01-01T00:00:00.000Z', value: 0 },
            { date: '2020-02-01T00:00:00.000Z', value: 0 },
            { date: '2020-03-01T00:00:00.000Z', value: 106 },
            { date: '2020-04-01T00:00:00.000Z', value: 374 },
            { date: '2020-05-01T00:00:00.000Z', value: 52 },
          ],
        },
      ],
    },
    product: [
      {
        hasChildren: true,
        isNotFilter: false,
        isParent: true,
        name: 'Mortgage',
        value: 185,
        parent: false,
        width: 0.5,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Conventional home mortgage',
        value: 108,
        parent: 'Mortgage',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'FHA mortgage',
        value: 44,
        parent: 'Mortgage',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'VA mortgage',
        value: 19,
        parent: 'Mortgage',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Other type of mortgage',
        value: 9,
        parent: 'Mortgage',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Home equity loan or line of credit (HELOC)',
        value: 5,
        parent: 'Mortgage',
        width: 0.4,
      },
      {
        hasChildren: false,
        isParent: false,
        key: 'Visualize sub-product and issue trends for Mortgage >',
        name: 'Visualize sub-product and issue trends for Mortgage >',
        splitterText: 'Visualize sub-product and issue trends for Mortgage >',
        value: '',
        parent: 'Mortgage',
        width: 0.5,
      },
      {
        hasChildren: true,
        isNotFilter: false,
        isParent: true,
        name: 'Credit card or prepaid card',
        value: 129,
        parent: false,
        width: 0.5,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'General-purpose credit card or charge card',
        value: 98,
        parent: 'Credit card or prepaid card',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Store credit card',
        value: 23,
        parent: 'Credit card or prepaid card',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Government benefit card',
        value: 6,
        parent: 'Credit card or prepaid card',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'General-purpose prepaid card',
        value: 2,
        parent: 'Credit card or prepaid card',
        width: 0.4,
      },
      {
        hasChildren: false,
        isParent: false,
        key: 'Visualize sub-product and issue trends for Credit card or prepaid card >',
        name: 'Visualize sub-product and issue trends for Credit card or prepaid card >',
        splitterText:
          'Visualize sub-product and issue trends for Credit card or prepaid card >',
        value: '',
        parent: 'Credit card or prepaid card',
        width: 0.5,
      },
      {
        hasChildren: true,
        isNotFilter: false,
        isParent: true,
        name: 'Credit reporting, credit repair services, or other personal consumer reports',
        value: 87,
        parent: false,
        width: 0.5,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Credit reporting',
        value: 84,
        parent:
          'Credit reporting, credit repair services, or other personal consumer reports',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Credit repair services',
        value: 2,
        parent:
          'Credit reporting, credit repair services, or other personal consumer reports',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Other personal consumer report',
        value: 1,
        parent:
          'Credit reporting, credit repair services, or other personal consumer reports',
        width: 0.4,
      },
      {
        hasChildren: false,
        isParent: false,
        key: 'Visualize sub-product and issue trends for Credit reporting, credit repair services, or other personal consumer reports >',
        name: 'Visualize sub-product and issue trends for Credit reporting, credit repair services, or other personal consumer reports >',
        splitterText:
          'Visualize sub-product and issue trends for Credit reporting, credit repair services, or other personal consumer reports >',
        value: '',
        parent:
          'Credit reporting, credit repair services, or other personal consumer reports',
        width: 0.5,
      },
      {
        hasChildren: true,
        isNotFilter: false,
        isParent: true,
        name: 'Checking or savings account',
        value: 43,
        parent: false,
        width: 0.5,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Checking account',
        value: 34,
        parent: 'Checking or savings account',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Savings account',
        value: 5,
        parent: 'Checking or savings account',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Other banking product or service',
        value: 3,
        parent: 'Checking or savings account',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'CD (Certificate of Deposit)',
        value: 1,
        parent: 'Checking or savings account',
        width: 0.4,
      },
      {
        hasChildren: false,
        isParent: false,
        key: 'Visualize sub-product and issue trends for Checking or savings account >',
        name: 'Visualize sub-product and issue trends for Checking or savings account >',
        splitterText:
          'Visualize sub-product and issue trends for Checking or savings account >',
        value: '',
        parent: 'Checking or savings account',
        width: 0.5,
      },
      {
        hasChildren: true,
        isNotFilter: false,
        isParent: true,
        name: 'Debt collection',
        value: 38,
        parent: false,
        width: 0.5,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Other debt',
        value: 12,
        parent: 'Debt collection',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'I do not know',
        value: 8,
        parent: 'Debt collection',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Medical debt',
        value: 8,
        parent: 'Debt collection',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Auto debt',
        value: 4,
        parent: 'Debt collection',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Credit card debt',
        value: 4,
        parent: 'Debt collection',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Federal student loan debt',
        value: 1,
        parent: 'Debt collection',
        width: 0.4,
      },
      {
        hasChildren: false,
        isNotFilter: false,
        isParent: false,
        name: 'Private student loan debt',
        value: 1,
        parent: 'Debt collection',
        width: 0.4,
      },
      {
        hasChildren: false,
        isParent: false,
        key: 'Visualize sub-product and issue trends for Debt collection >',
        name: 'Visualize sub-product and issue trends for Debt collection >',
        splitterText:
          'Visualize sub-product and issue trends for Debt collection >',
        value: '',
        parent: 'Debt collection',
        width: 0.5,
      },
    ],
  },
  subLens: '',
  tooltip: false,
  total: 532,
  trendDepth: 5,
};
