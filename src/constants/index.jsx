// Internal triggers
export const PAGE_CHANGED              = 'PAGE_CHANGED'
export const SEARCH_CHANGED            = 'SEARCH_CHANGED'
export const SIZE_CHANGED              = 'SIZE_CHANGED'
export const SORT_CHANGED              = 'SORT_CHANGED'
export const URL_CHANGED               = 'URL_CHANGED'
export const FILTER_CHANGED            = 'FILTER_CHANGED'
export const FILTER_REMOVED            = 'FILTER_REMOVED'
export const FILTER_ALL_REMOVED        = 'FILTER_ALL_REMOVED'
export const FILTER_MULTIPLE_ADDED     = 'FILTER_MULTIPLE_ADDED'
export const FILTER_MULTIPLE_REMOVED   = 'FILTER_MULTIPLE_REMOVED'
export const MODAL_HID                 = 'MODAL_HID'
export const MODAL_SHOWN               = 'MODAL_SHOWN'

// External Triggers
export const COMPLAINTS_RECEIVED       = 'COMPLAINTS_RECEIVED'
export const COMPLAINTS_FAILED         = 'COMPLAINTS_FAILED'

// Modal Dialogs
export const MODAL_TYPE_DATA_EXPORT     = 'MODAL_TYPE_DATA_EXPORT'

// Useful constants
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

export const SLUG_SEPARATOR            = '•'

// Keyboard
export const VK_DOWN                   = 40
export const VK_ENTER                  = 14
export const VK_ESCAPE                 = 27
export const VK_RETURN                 = 13
export const VK_TAB                    = 9
export const VK_UP                     = 38

///////////////////////////////////////////////////////////////////////////////
// JSON Objects

export const THESE_UNITED_STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
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
