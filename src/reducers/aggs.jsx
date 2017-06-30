import { COMPLAINTS_RECEIVED } from '../constants'

export const defaultAggs = {
  timely_response: [
    {key: 'No', active: true, doc_count: 678845},
    {key: 'Yes', active: false, doc_count: 487578}
  ],
  company_response: [
    {key: 'Closed with explanation', active: false, doc_count: 574783},
    {key: 'Closed with monetary relief', active: false, doc_count: 151083},
    {key: 'Closed with non-monetary relief', active: false, doc_count: 94550},
    {key: 'Untimely response', active: false, doc_count: 26894},
    {key: 'Closed', active: false, doc_count: 19151},
    {key: 'Closed without relief', active: false, doc_count: 4263},
    {key: 'Closed with relief', active: false, doc_count: 1347},
    {key: 'In progress', active: false, doc_count: 587},
  ]
}

export default (state = defaultAggs, action) => {
  switch(action.type) {
  case COMPLAINTS_RECEIVED:
    // TODO: Handle translating the buckets to aggs state here
    return state
  default:
    return state
  }
}
