export const listOfIssues = [
  {
    key: 'Improper use of your report',
    doc_count: 3333,
    'sub_issue.raw': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'Reporting company used your report improperly',
          doc_count: 2602,
        },
        {
          key: "Credit inquiries on your report that you don't recognize",
          doc_count: 717,
        },
      ],
    },
  },
  {
    key: 'Incorrect information on your report',
    doc_count: 2758,
    'sub_issue.raw': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'Information belongs to someone else',
          doc_count: 2431,
        },
        {
          key: 'Account information incorrect',
          doc_count: 542,
        },
      ],
    },
  },
];
