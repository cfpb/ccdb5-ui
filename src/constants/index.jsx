// Internal triggers
export const API_CALLED = 'API_CALLED'
export const DATE_RANGE_CHANGED = 'DATE_RANGE_CHANGED'
export const PAGE_CHANGED = 'PAGE_CHANGED'
export const SEARCH_CHANGED = 'SEARCH_CHANGED'
export const SIZE_CHANGED = 'SIZE_CHANGED'
export const SORT_CHANGED = 'SORT_CHANGED'
export const URL_CHANGED = 'URL_CHANGED'
export const FILTER_CHANGED = 'FILTER_CHANGED'
export const FILTER_FLAG_CHANGED = 'FILTER_FLAG_CHANGED'
export const FILTER_REMOVED = 'FILTER_REMOVED'
export const FILTER_ALL_REMOVED = 'FILTER_ALL_REMOVED'
export const FILTER_MULTIPLE_ADDED = 'FILTER_MULTIPLE_ADDED'
export const FILTER_MULTIPLE_REMOVED = 'FILTER_MULTIPLE_REMOVED'
export const MODAL_HID = 'MODAL_HID'
export const MODAL_SHOWN = 'MODAL_SHOWN'

// External Triggers
export const COMPLAINTS_RECEIVED = 'COMPLAINTS_RECEIVED'
export const COMPLAINTS_FAILED = 'COMPLAINTS_FAILED'
export const COMPLAINT_DETAIL_RECEIVED = 'COMPLAINT_DETAIL_RECEIVED'
export const COMPLAINT_DETAIL_FAILED = 'COMPLAINT_DETAIL_FAILED'

// Modal Dialogs
export const MODAL_TYPE_DATA_EXPORT = 'MODAL_TYPE_DATA_EXPORT'
export const MODAL_TYPE_MORE_ABOUT = 'MODAL_TYPE_MORE_ABOUT'

// Useful constants
export const NARRATIVE_SEARCH_FIELD = 'complaint_what_happened'

export const knownFilters = [
  'company',
  'company_public_response',
  'company_response',
  'consumer_consent_provided',
  'consumer_disputed',
  'issue',
  'product',
  'state',
  'submitted_via',
  'tag',
  'timely',
  'zip_code'
]

export const dateFilters = [
  'company_received_max',
  'company_received_min',
  'date_received_max',
  'date_received_min'
]

export const flagFilters = [
  'has_narrative'
]

export const SLUG_SEPARATOR = '•'

// Keyboard
export const VK_DOWN = 40
export const VK_ENTER = 14
export const VK_ESCAPE = 27
export const VK_RETURN = 13
export const VK_TAB = 9
export const VK_UP = 38

/// ////////////////////////////////////////////////////////////////////////////
// JSON Objects

export const THESE_UNITED_STATES = {
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
  WY: 'Wyoming'
}
