import { COMPLAINTS_RECEIVED } from '../constants'

export const defaultAggs = {
  company: [],
  company_public_response: [],
  company_response: [],
  consumer_consent_provided: [],
  consumer_disputed: [],
  issue: [],
  product: [],
  state: [],
  submitted_via: [],
  tag: [],
  timely: [],
  zip_code: []
}

const mapTitleToFilter = {
  'Company public response': 'company_public_response',
  'Company response': 'company_response',
  'Consumer Consent': 'consumer_consent_provided',
  'Did company provide a timely response?': 'timely',
  'Did the consumer dispute the response?': 'consumer_disputed',
  'How did the consumer submit the complaint to CFPB?': 'submitted_via',
  'Issue / Subissue': 'issue',
  'Matched company name': 'company',
  'Product / Subproduct': 'product',
  'State': 'state',
  'Tags': 'tag',
  'Zip code': 'zip_code',
}

export default (state = defaultAggs, action) => {
  switch(action.type) {
  case COMPLAINTS_RECEIVED:
    const aggs = action.data.aggregations
    const keys = Object.keys(aggs)
    const result = {...state}

    keys.forEach(key => {
      const internalKey = mapTitleToFilter[key]
      result[internalKey] = aggs[key][key].buckets
    })

    return result

  default:
    return state
  }
}