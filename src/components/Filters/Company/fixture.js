export const aggResponse = { took: 3, timed_out: false, _shards: { total: 5, successful: 5, skipped: 0, failed: 0 }, hits: { total: { value: 4291676, relation: 'eq' }, max_score: null, hits: [] }, aggregations: { company: { doc_count: 4291676, company: { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ key: 'Monocle Popper Inc', doc_count: 9999 }, { key: 'Safe-T Deposits LLC', doc_count: 999 }, { key: 'Securitized Collateral Risk Obligations Credit Co', doc_count: 99 }, { key: 'EZ Credit', doc_count: 9 }] } } }, _meta: { license: 'CC0', last_updated: '2024-11-04T12:00:00-05:00', last_indexed: '2024-11-04T12:00:00-05:00', total_record_count: 6625190, is_data_stale: false, has_data_issue: false, break_points: {} } };