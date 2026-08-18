import { LIST_COMPLAINTS_SELECTORS as LIST } from './tour-step-selectors';

const generateLinkText = (index, linkObject) =>
  `<li><button class="a-btn a-btn--link" onclick="(function(){var t=window.__ccdbDom&&window.__ccdbDom.querySelectorAll('.introjs-bullets li a')[${index + 1}];t&&t.click();})()">` +
  linkObject[1].label +
  '</button></li>';

let listIndex = '';
for (const [key, value] of Object.entries(LIST).slice(1).entries()) {
  listIndex += generateLinkText(key, value);
}

export const TOUR_STEPS = [
  {
    element: LIST.STEP_1.selector,
    intro:
      '<div>' +
      '<div class="left">' +
      'Welcome to the Consumer Complaint Database!' +
      '<br /><br />' +
      'Complaints the CFPB sends to companies for response are published in the Consumer Complaint Database after the company responds, confirming a commercial relationship with the consumer, or after 15 days, whichever comes first.' +
      '<br /><br />' +
      'Complaints the CFPB refers to other regulators, such as complaints about depository institutions with less than $10 billion in assets, are not published in the database. This database is not a statistical sample of consumers’ experiences in the marketplace.' +
      '</div>' +
      '<div class="right">' +
      '<h4>Index</h4>' +
      '<ul>' +
      listIndex +
      '</ul></div>' +
      '</div>',
    tooltipClass: 'wide',
  },
  {
    element: LIST.STEP_2.selector,
    intro: 'These links provide more information about this database.',
  },
  {
    element: LIST.STEP_3.selector,
    intro:
      'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.',
  },
  {
    element: LIST.STEP_4.selector,
    intro:
      'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br /> The default date range is three years from today’s date.',
  },
  {
    element: LIST.STEP_5.selector,
    intro:
      'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
      '<br /><br />' +
      'Expand a product or issue to see its sub-products or sub-issues, where available. ',
  },
  {
    element: LIST.STEP_6.selector,
    intro:
      'The blue show/hide icon allows you to expand or collapse specific filters.',
  },
  {
    element: LIST.STEP_7.selector,
    intro:
      'Use the “Search within” bar to find specific words or phrases in complaints. By default, this will search “All data”, but you can change this using the gray dropdown menu.' +
      '<br /> <br />' +
      'Click “Show advanced search tips” to see some advanced ways to refine your word search.',
  },
  {
    element: LIST.STEP_8.selector,
    intro:
      'As you apply filters and search terms, this will display how many complaints are included out of the total number of complaints published in the database.',
  },
  {
    element: LIST.STEP_9.selector,
    intro: 'You can download complaint data as CSV by selecting “Export data”.',
  },
  {
    element: LIST.STEP_10.selector,
    intro: 'Select “Print” to generate a pdf of the current page.',
  },
  {
    element: LIST.STEP_11.selector,
    intro: 'Select the number of complaints to view per page here.',
  },
  {
    element: LIST.STEP_12.selector,
    intro:
      'Sort complaints by “Newest to oldest,” “Oldest to newest,” “Relevance,” and “Relevance (asc).”' +
      '<br /><br />' +
      'Relevancy are based on any applied search terms.',
  },
  {
    element: LIST.STEP_13.selector,
    intro:
      'These are your search results. As you apply filters and search terms, your results will display here. This view shows a preview of the complaint.',
  },
  {
    element: LIST.STEP_14.selector,
    intro:
      'Click the blue ID number to see more details about a particular complaint.',
  },
];
