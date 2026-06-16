/**
 * Reusable tour target selectors scoped under `.ccdb-content`.
 *
 * Scoping keeps intro.js from matching similar class names on the host page
 * when the widget runs inside a shadow root and our DOM helper falls back
 * to `document` (or when selectors are resolved too early).
 *
 * Prefer `.filter-panel` over `aside.content__sidebar` for filter steps:
 * the sidebar is a layout wrapper (padding, tab class names, full column
 * height) while `.filter-panel` is the actual "Filter results by" UI that
 * the tour copy describes. A sidebar highlight is often oversized and can
 * look misaligned, especially in the embedded layout.
 */
export const TOUR_SCOPE = '.ccdb-content';

const SIDEBAR = `${TOUR_SCOPE} aside.content__sidebar`;
const FILTER_PANEL = `${SIDEBAR} .filter-panel`;

export const TOUR_SELECTORS = {
  CONTENT: `${TOUR_SCOPE}.content`,
  HERO_LINKS: `${TOUR_SCOPE} header.content__hero .m-list--horizontal`,
  // data-tour avoids matching Trends lens tabs (.tabbed-navigation.lens)
  TABBED_NAVIGATION: `${TOUR_SCOPE} [data-tour="tabbed-navigation"] section`,
  FILTER_PANEL,
  DATE_FILTER: `${FILTER_PANEL} .date-filter`,
  PRODUCT_AGGREGATION: `${FILTER_PANEL} .aggregation.product`,
  FILTER_SHOW_HIDE: `${FILTER_PANEL} .aggregation button`,
  SEARCH_BAR: `${TOUR_SCOPE} .search-bar`,
  SEARCH_SUMMARY: `${TOUR_SCOPE} #search-summary`,
  // Design-system link buttons render as <a>, not <button>
  EXPORT_BTN: `${TOUR_SCOPE} .export-results .export-btn`,
  PRINT_BTN: `${TOUR_SCOPE} .export-results .print-preview`,
  MAP_SHADING: `${TOUR_SCOPE} .map-shading`,
  TILE_MAP: `${TOUR_SCOPE} #tile-chart-map`,
  ROW_CHART_SECTION: `${TOUR_SCOPE} [data-tour="row-chart-section"]`,
  MAP_ROW_CHART_SECTION: `${TOUR_SCOPE} .map-panel [data-tour="row-chart-section"]`,
  SELECT_SIZE: `${TOUR_SCOPE} [data-tour="select-size"]`,
  SELECT_SORT: `${TOUR_SCOPE} [data-tour="select-sort"]`,
  SELECT_LENS: `${TOUR_SCOPE} [data-tour="select-lens"]`,
  SELECT_INTERVAL: `${TOUR_SCOPE} [data-tour="select-interval"]`,
  NARRATIVES_BUTTONS: `${TOUR_SCOPE} .refine-bar section.narratives-buttons .m-btn-group`,
  CARDS_PANEL: `${TOUR_SCOPE} .cards-panel`,
  TO_DETAIL: `${TOUR_SCOPE} .cards-panel .to-detail`,
  ROW_CHART_EXPANDABLE: `${TOUR_SCOPE} #row-chart-product .tick.expandable`,
  MOBILE_FILTER_TOGGLE: `${TOUR_SCOPE} .filter-panel-toggle .m-btn-group .a-btn`,
};

const tourStep = (selector, label) => ({ selector, label });

/** Semantic targets shared across Map, List, and Trends tours. */
export const TOUR_STEP_TARGETS = {
  INDEX: tourStep(TOUR_SELECTORS.CONTENT, 'Index'),
  HELP_LINKS: tourStep(TOUR_SELECTORS.HERO_LINKS, 'Help Links'),
  VIEWS: tourStep(TOUR_SELECTORS.TABBED_NAVIGATION, 'Views'),
  FILTERS: tourStep(TOUR_SELECTORS.FILTER_PANEL, 'Filters'),
  DATE_RECEIVED: tourStep(TOUR_SELECTORS.DATE_FILTER, 'Date Received'),
  PRODUCT_ISSUE: tourStep(TOUR_SELECTORS.PRODUCT_AGGREGATION, 'Product/Issue'),
  SHOW_HIDE: tourStep(TOUR_SELECTORS.FILTER_SHOW_HIDE, 'Show/Hide'),
  SEARCH_BAR: tourStep(TOUR_SELECTORS.SEARCH_BAR, 'Search Bar'),
  SEARCH_SUMMARY: tourStep(TOUR_SELECTORS.SEARCH_SUMMARY, 'Search Summary'),
  EXPORT_DATA: tourStep(TOUR_SELECTORS.EXPORT_BTN, 'Export Data'),
  PRINT_PAGE: tourStep(TOUR_SELECTORS.PRINT_BTN, 'Print Page'),
  TABBED_NAVIGATION: tourStep(
    TOUR_SELECTORS.TABBED_NAVIGATION,
    'Tabbed Navigation',
  ),
  MAP_SHADING: tourStep(TOUR_SELECTORS.MAP_SHADING, 'Map Shading'),
  TILE_MAP: tourStep(TOUR_SELECTORS.TILE_MAP, 'Tile Map'),
  ROW_CHARTS: tourStep(TOUR_SELECTORS.ROW_CHART_SECTION, 'Row Charts'),
  MAP_ROW_CHARTS: tourStep(TOUR_SELECTORS.MAP_ROW_CHART_SECTION, 'Row Charts'),
  SELECT_SIZE: tourStep(TOUR_SELECTORS.SELECT_SIZE, 'Show Number'),
  SELECT_SORT: tourStep(TOUR_SELECTORS.SELECT_SORT, 'Sort Results'),
  SELECT_LENS: tourStep(TOUR_SELECTORS.SELECT_LENS, 'Aggregate By'),
  SELECT_INTERVAL: tourStep(TOUR_SELECTORS.SELECT_INTERVAL, 'Date Interval'),
  NARRATIVES: tourStep(TOUR_SELECTORS.NARRATIVES_BUTTONS, 'Show Narratives'),
  RESULTS: tourStep(TOUR_SELECTORS.CARDS_PANEL, 'Results'),
  COMPLAINT_DETAIL: tourStep(
    TOUR_SELECTORS.TO_DETAIL,
    'View Detailed Complaints',
  ),
};
