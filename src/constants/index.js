// Internal triggers
import { formatDate } from '../utils/formatDate';

export const DATE_RANGE_MIN = '2011-12-01';

// dayjs formatter to uses for custom validation
// https://day.js.org/docs/en/parse/string-format
export const DATE_VALIDATION_FORMAT = 'M/D/YYYY';

export const maxDate = formatDate(new Date());
export const minDate = formatDate(DATE_RANGE_MIN);

// Modal Dialogs
export const MODAL_TYPE_DATA_EXPORT = 'MODAL_TYPE_DATA_EXPORT';
export const MODAL_TYPE_EXPORT_CONFIRMATION = 'MODAL_TYPE_EXPORT_CONFIRMATION';
export const MODAL_TYPE_MORE_ABOUT = 'MODAL_TYPE_MORE_ABOUT';

// view modes
export const MODE_MAP = 'Map';
export const MODE_LIST = 'List';
export const MODE_TRENDS = 'Trends';

// map normalization modes
export const GEO_NORM_NONE = 'None';
export const GEO_NORM_PER1000 = 'Per 1000 pop.';

// Useful constants
export const NARRATIVE_SEARCH_FIELD = 'complaint_what_happened';

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
  'tags',
  'timely',
  'zip_code',
];

export const dateFilters = [
  'company_received_max',
  'company_received_min',
  'date_received_max',
  'date_received_min',
];

export const dateIntervals = ['Day', 'Week', 'Month', 'Quarter', 'Year'];
export const dateRanges = {
  '3m': '3 months',
  '6m': '6 months',
  '1y': '1 year',
  '3y': '3 years',
  All: 'Full date range',
};

// list of fields that we don't include in the URL or Query to keep things tidy
export const excludeFields = [
  'enablePer1000',
  'mapWarningEnabled',
  'totalPages',
  'trendsDateWarningEnabled',
];

export const flagFilters = ['has_narrative'];

// these filters we need to shim subItems when a parent is selected
export const filterPatch = ['issue', 'product'];

export const lenses = ['Overview', 'Company', 'Product'];

// note the keys need to remain strings here for the select box options
// we're declaring this so eslint autofix doesn't rename the props without
// quotes
export const sizes = {};
sizes['10'] = '10 results';
sizes['25'] = '25 results';
sizes['50'] = '50 results';
sizes['100'] = '100 results';

export const sorts = {
  created_date_desc: 'Newest to oldest',
  created_date_asc: 'Oldest to newest',
  relevance_desc: 'Relevance',
  relevance_asc: 'Relevance (asc)',
};

export const SLUG_SEPARATOR = '•';

// Keyboard
export const VK_DOWN = 40;
export const VK_ENTER = 14;
export const VK_ESCAPE = 27;
export const VK_RETURN = 13;
export const VK_TAB = 9;
export const VK_UP = 38;

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
  WY: 'Wyoming',
};

export const TILE_MAP_STATES = [
  'AK',
  'AL',
  'AR',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
];

// 2017 ACS census via the census API:
// https://api.census.gov/data/2017/acs/acs5?get=B01003_001E,NAME&for=state
//
// B01003_001E is defined as TOTAL POPULATION
// (detailed here: https://api.census.gov/data/2016/acs/acs5/variables.html)
export const STATE_DATA = {
  AL: {
    abbr: 'AL',
    name: 'Alabama',
    population: '4850771',
    id: '01',
  },
  AK: {
    abbr: 'AK',
    name: 'Alaska',
    population: '738565',
    id: '02',
  },
  AZ: {
    abbr: 'AZ',
    name: 'Arizona',
    population: '6809946',
    id: '04',
  },
  AR: {
    abbr: 'AR',
    name: 'Arkansas',
    population: '2977944',
    id: '05',
  },
  CA: {
    abbr: 'CA',
    name: 'California',
    population: '38982847',
    id: '06',
  },
  CO: {
    abbr: 'CO',
    name: 'Colorado',
    population: '5436519',
    id: '08',
  },
  CT: {
    abbr: 'CT',
    name: 'Connecticut',
    population: '3594478',
    id: '09',
  },
  DE: {
    abbr: 'DE',
    name: 'Delaware',
    population: '943732',
    id: '10',
  },
  DC: {
    abbr: 'DC',
    name: 'District of Columbia',
    population: '672391',
    id: '11',
  },
  FL: {
    abbr: 'FL',
    name: 'Florida',
    population: '20278447',
    id: '12',
  },
  GA: {
    abbr: 'GA',
    name: 'Georgia',
    population: '10201635',
    id: '13',
  },
  HI: {
    abbr: 'HI',
    name: 'Hawaii',
    population: '1421658',
    id: '15',
  },
  ID: {
    abbr: 'ID',
    name: 'Idaho',
    population: '1657375',
    id: '16',
  },
  IL: {
    abbr: 'IL',
    name: 'Illinois',
    population: '12854526',
    id: '17',
  },
  IN: {
    abbr: 'IN',
    name: 'Indiana',
    population: '6614418',
    id: '18',
  },
  IA: {
    abbr: 'IA',
    name: 'Iowa',
    population: '3118102',
    id: '19',
  },
  KS: {
    abbr: 'KS',
    name: 'Kansas',
    population: '2903820',
    id: '20',
  },
  KY: {
    abbr: 'KY',
    name: 'Kentucky',
    population: '4424376',
    id: '21',
  },
  LA: {
    abbr: 'LA',
    name: 'Louisiana',
    population: '4663461',
    id: '22',
  },
  ME: {
    abbr: 'ME',
    name: 'Maine',
    population: '1330158',
    id: '23',
  },
  MD: {
    abbr: 'MD',
    name: 'Maryland',
    population: '5996079',
    id: '24',
  },
  MA: {
    abbr: 'MA',
    name: 'Massachusetts',
    population: '6789319',
    id: '25',
  },
  MI: {
    abbr: 'MI',
    name: 'Michigan',
    population: '9925568',
    id: '26',
  },
  MN: {
    abbr: 'MN',
    name: 'Minnesota',
    population: '5490726',
    id: '27',
  },
  MS: {
    abbr: 'MS',
    name: 'Mississippi',
    population: '2986220',
    id: '28',
  },
  MO: {
    abbr: 'MO',
    name: 'Missouri',
    population: '6075300',
    id: '29',
  },
  MT: {
    abbr: 'MT',
    name: 'Montana',
    population: '1029862',
    id: '30',
  },
  NE: {
    abbr: 'NE',
    name: 'Nebraska',
    population: '1893921',
    id: '31',
  },
  NV: {
    abbr: 'NV',
    name: 'Nevada',
    population: '2887725',
    id: '32',
  },
  NH: {
    abbr: 'NH',
    name: 'New Hampshire',
    population: '1331848',
    id: '33',
  },
  NJ: {
    abbr: 'NJ',
    name: 'New Jersey',
    population: '8960161',
    id: '34',
  },
  NM: {
    abbr: 'NM',
    name: 'New Mexico',
    population: '2084828',
    id: '35',
  },
  NY: {
    abbr: 'NY',
    name: 'New York',
    population: '19798228',
    id: '36',
  },
  NC: {
    abbr: 'NC',
    name: 'North Carolina',
    population: '10052564',
    id: '37',
  },
  ND: {
    abbr: 'ND',
    name: 'North Dakota',
    population: '745475',
    id: '38',
  },
  OH: {
    abbr: 'OH',
    name: 'Ohio',
    population: '11609756',
    id: '39',
  },
  OK: {
    abbr: 'OK',
    name: 'Oklahoma',
    population: '3896251',
    id: '40',
  },
  OR: {
    abbr: 'OR',
    name: 'Oregon',
    population: '4025127',
    id: '41',
  },
  PA: {
    abbr: 'PA',
    name: 'Pennsylvania',
    population: '12790505',
    id: '42',
  },
  PR: {
    abbr: 'PR',
    name: 'Puerto Rico',
    population: '3468963',
    id: '72',
  },
  RI: {
    abbr: 'RI',
    name: 'Rhode Island',
    population: '1056138',
    id: '44',
  },
  SC: {
    abbr: 'SC',
    name: 'South Carolina',
    population: '4893444',
    id: '45',
  },
  SD: {
    abbr: 'SD',
    name: 'South Dakota',
    population: '855444',
    id: '46',
  },
  TN: {
    abbr: 'TN',
    name: 'Tennessee',
    population: '6597381',
    id: '47',
  },
  TX: {
    abbr: 'TX',
    name: 'Texas',
    population: '27419612',
    id: '48',
  },
  UT: {
    abbr: 'UT',
    name: 'Utah',
    population: '2993941',
    id: '49',
  },
  VT: {
    abbr: 'VT',
    name: 'Vermont',
    population: '624636',
    id: '50',
  },
  VA: {
    abbr: 'VA',
    name: 'Virginia',
    population: '8365952',
    id: '51',
  },
  WA: {
    abbr: 'WA',
    name: 'Washington',
    population: '7169967',
    id: '53',
  },
  WV: {
    abbr: 'WV',
    name: 'West Virginia',
    population: '1836843',
    id: '54',
  },
  WI: {
    abbr: 'WI',
    name: 'Wisconsin',
    population: '5763217',
    id: '55',
  },
  WY: {
    abbr: 'WY',
    name: 'Wyoming',
    population: '583200',
    id: '56',
  },
};

export const API_PLACEHOLDER = '@@API';

// provide relative link when not local development
export const LINK_DATA_USE =
  window.location.origin.indexOf('localhost') > -1
    ? 'https://www.consumerfinance.gov/complaint/data-use/'
    : '/complaint/data-use/';
