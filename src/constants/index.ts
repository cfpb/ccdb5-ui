// Internal triggers
import { formatDate } from '../utils/format-date';

export const DATE_RANGE_MIN = '2011-12-01';

// dayjs formatter to uses for custom validation
// https://day.js.org/docs/en/parse/string-format
export const DATE_VALIDATION_FORMAT = 'M/D/YYYY';

export const maxDate = formatDate(new Date());
export const minDate = formatDate(DATE_RANGE_MIN);

// Modal Dialogs
export const MODAL_TYPE_MORE_ABOUT = 'MODAL_TYPE_MORE_ABOUT';

export const knownFilters = [
  'company',
  'company_public_response',
  'company_response',
  'issue',
  'product',
  'state',
  'submitted_via',
  'tags',
  'timely',
  'zip_code',
] as const;

export const dateFilters = [
  'company_received_max',
  'company_received_min',
  'date_received_max',
  'date_received_min',
] as const;

export const dateRanges = {
  '3m': '3 months',
  '6m': '6 months',
  '1y': '1 year',
  '3y': '3 years',
  All: 'Full date range',
} as const;

// these filters we need to shim subItems when a parent is selected
export const filterPatch = ['issue', 'product'] as const;

// note the keys need to remain strings here for the select box options
// we're declaring this so eslint autofix doesn't rename the props without
// quotes
export const sizes: Record<string, string> = {};
sizes['10'] = '10 results';
sizes['25'] = '25 results';
sizes['50'] = '50 results';
sizes['100'] = '100 results';

export const sorts = {
  created_date_desc: 'Newest to oldest',
  created_date_asc: 'Oldest to newest',
  relevance_desc: 'Most relevant',
  relevance_asc: 'Least relevant',
} as const;
export const SLUG_SEPARATOR = '•';

/// ////////////////////////////////////////////////////////////////////////////
// JSON Objects

export const THESE_UNITED_STATES: Record<string, string> = {
  AA: 'Armed Forces Americas',
  AE: 'Armed Forces Europe',
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AP: 'Armed Forces Pacific',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

export const API_PLACEHOLDER = '@@API';

// provide relative link when not local development
export const LINK_DATA_USE = location.origin.includes('localhost')
  ? 'https://www.consumerfinance.gov/complaint/data-use/'
  : '/complaint/data-use/';
