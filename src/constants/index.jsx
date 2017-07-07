// Internal triggers
export const PAGE_CHANGED              = 'PAGE_CHANGED'
export const SEARCH_CHANGED            = 'SEARCH_CHANGED'
export const SIZE_CHANGED              = 'SIZE_CHANGED'
export const SORT_CHANGED              = 'SORT_CHANGED'
export const URL_CHANGED               = 'URL_CHANGED'
export const FILTER_CHANGED            = 'FILTER_CHANGED'
export const FILTER_REMOVED            = 'FILTER_REMOVED'
export const FILTER_ALL_REMOVED        = 'FILTER_ALL_REMOVED'
export const FILTER_PARENT_CHECKED     = 'FILTER_PARENT_CHECKED'

// External Triggers
export const COMPLAINTS_RECEIVED       = 'COMPLAINTS_RECEIVED'
export const COMPLAINTS_FAILED         = 'COMPLAINTS_FAILED'

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