export const selectQueryState = state => state.query;
export const selectQueryCompanyReceivedMax =
  state => state.query.company_received_max
export const selectQueryCompanyReceivedMin =
  state => state.query.company_received_min

export const selectQueryDateReceivedMax = state => state.query.date_received_max
export const selectQueryDateReceivedMin = state => state.query.date_received_min
export const selectQueryDateRange = state => state.query.dateRange;

export const selectQueryHasNarrative = state => state.query.has_narrative;

export const selectQueryTab = state => state.query.tab
