export const selectAggsRootState = (state) => state.aggs;
export const selectAggsActiveCall = (state) => state.aggs.activeCall;
export const selectAggsDocCount = (state) => state.aggs.doc_count;
export const selectAggsHasDataIssue = (state) => state.aggs.hasDataIssue;
export const selectAggsHasError = (state) => state.aggs.error;
export const selectAggsIsDataStale = (state) => state.aggs.isDataStale;
export const selectAggsLastIndexed = (state) => state.aggs.lastIndexed;
export const selectAggsTotal = (state) => state.aggs.total;
export const selectAggsCompany = (state) => state.aggs.company;
export const selectAggsCompanyPublicResponse = (state) =>
  state.aggs.company_public_response;
export const selectAggsCompanyResponse = (state) => state.aggs.company_response;
export const selectAggsConsumerConsentRequired = (state) =>
  state.aggs.consumer_consent_provided;
export const selectAggsConsumerDisputed = (state) =>
  state.aggs.consumer_disputed;
export const selectAggsIssue = (state) => state.aggs.issue;
export const selectAggsProduct = (state) => state.aggs.product;
export const selectAggsState = (state) => state.aggs.state;
export const selectAggsSubmittedVia = (state) => state.aggs.submitted_via;
export const selectAggsTag = (state) => state.aggs.tag;
export const selectAggsTimely = (state) => state.aggs.timely;
export const selectAggsZipCode = (state) => state.aggs.zip_code;
