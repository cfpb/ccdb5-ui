export default {
  foo: {},
  issue: {
    doc_count: 1000,
    issue: {
      buckets: [
        { key: 'alpha', doc_count: 600 },
        { key: 'bar', doc_count: 150 },
        { key: 'car', doc_count: 125 },
        { key: 'delta', doc_count: 75 },
        { key: 'elephant', doc_count: 50 }
      ]
    }
  },
  product: {
    doc_count: 1000,
    product: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'foo', doc_count: 600 },
        { key: 'goo', doc_count: 150 },
        { key: 'hi', doc_count: 125 },
        { key: 'indigo', doc_count: 75 },
        { key: 'joker', doc_count: 50 }
      ]
    }
  },
  state: {
    doc_count: 469472,
    state: {
      buckets: [
        { key: 'CA', doc_count: 62519 },
        { key: 'FL', doc_count: 47358 },
        { key: 'TX', doc_count: 44469 },
        { key: 'GA', doc_count: 28395 },
        { key: 'NY', doc_count: 26846 },
        { key: 'IL', doc_count: 18172 },
        { key: 'PA', doc_count: 16054 },
        { key: 'NC', doc_count: 15217 },
        { key: 'NJ', doc_count: 15130 },
        { key: 'OH', doc_count: 14365 },
        { key: 'VA', doc_count: 12901 },
        { key: 'MD', doc_count: 12231 },
        { key: 'MI', doc_count: 10472 },
        { key: 'AZ', doc_count: 10372 },
        { key: 'TN', doc_count: 9011 },
        { key: 'WA', doc_count: 8542 },
        { key: 'MA', doc_count: 8254 },
        { key: 'MO', doc_count: 7832 },
        { key: 'SC', doc_count: 7496 },
        { key: 'CO', doc_count: 7461 },
        { key: 'NV', doc_count: 7095 },
        { key: 'LA', doc_count: 6369 },
        { key: 'AL', doc_count: 6178 },
        { key: 'IN', doc_count: 5659 },
        { key: 'MN', doc_count: 4957 },
        { key: 'CT', doc_count: 4685 },
        { key: 'WI', doc_count: 4443 },
        { key: 'OR', doc_count: 4261 },
        { key: 'UT', doc_count: 3693 },
        { key: 'KY', doc_count: 3392 },
        { key: 'MS', doc_count: 3237 },
        { key: 'OK', doc_count: 2989 },
        { key: 'AR', doc_count: 2691 },
        { key: 'DC', doc_count: 2493 },
        { key: 'KS', doc_count: 2307 },
        { key: 'NM', doc_count: 2176 },
        { key: 'DE', doc_count: 2160 },
        { key: '', doc_count: 1824 },
        { key: 'IA', doc_count: 1751 },
        // NOTE: Hawaii intentionally left out to test patching of data
        // { key: 'HI', doc_count: 1552 },
        { key: 'ID', doc_count: 1436 },
        { key: 'NH', doc_count: 1408 },
        { key: 'NE', doc_count: 1343 },
        { key: 'RI', doc_count: 1166 },
        { key: 'ME', doc_count: 1155 },
        { key: 'WV', doc_count: 1075 },
        { key: 'PR', doc_count: 909 },
        { key: 'MT', doc_count: 788 },
        { key: 'ND', doc_count: 637 },
        { key: 'SD', doc_count: 535 },
        { key: 'AK', doc_count: 524 },
        { key: 'WY', doc_count: 450 },
        { key: 'VT', doc_count: 446 },
        { key: 'AE', doc_count: 194 },
        { key: 'AP', doc_count: 153 },
        { key: 'GU', doc_count: 85 },
        { key: 'FM', doc_count: 54 },
        { key: 'VI', doc_count: 51 },
        { key: 'UNITED STATES MINOR OUTLYING ISLANDS', doc_count: 28 },
        { key: 'AA', doc_count: 9 },
        { key: 'MP', doc_count: 7 },
        { key: 'AS', doc_count: 6 },
        { key: 'MH', doc_count: 3 },
        { key: 'PW', doc_count: 1 }
      ]
    }
  }
}