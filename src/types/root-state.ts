/**
 * Incremental Redux state types.
 * Slice files are still JS; keep these in sync with each slice's initialState
 * until those files are converted and we can derive RootState from the store.
 */

export interface FiltersState {
  company: string[];
  company_public_response: string[];
  company_response: string[];
  issue: string[];
  product: string[];
  state: string[];
  submitted_via: string[];
  tags: string[];
  timely: string[];
  zip_code: string[];
}

export interface QueryState {
  company_received_max: string;
  company_received_min: string;
  dateRange: string;
  dateLastIndexed: string;
  date_received_max: string;
  date_received_min: string;
  from: number;
  page: number;
  searchAfter: string;
  searchField: string;
  searchText: string;
  size: number;
  sort: string;
}

export interface ViewState {
  isPrintMode: boolean;
  hasAdvancedSearchTips: boolean;
  hasFilters: boolean;
  isMoreAboutModalOpen: boolean;
  showTour: boolean;
  width: number;
}

export interface RoutesState {
  path: string;
  params: Record<string, unknown>;
  queryString: string;
}

export interface ActionsState {
  actions: unknown[];
}

export interface RootState {
  api: unknown;
  actions?: ActionsState;
  filters: FiltersState;
  query: QueryState;
  routes: RoutesState;
  view: ViewState;
}
