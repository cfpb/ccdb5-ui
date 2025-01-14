import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../../constants';

import {
  GEO_STEP_SELECTORS as GEO,
  LIST_COMPLAINTS_SELECTORS as LIST,
  TRENDS_SELECTORS as TRENDS,
} from './tourStepSelectors';

const generateLinkText = (index, linkObject) =>
  `<li><button class="a-btn a-btn--link" onclick="document.querySelectorAll('.introjs-bullets li a')[${
    index + 1
  }].click()">` +
  linkObject[1].label +
  '</button></li>';

let geoIndex = '';

// we exclude the first entry so we can have Index appear as the title
Object.entries(GEO)
  .slice(1)
  .forEach((value, key) => {
    geoIndex += generateLinkText(key, value);
  });

let listIndex = '';
Object.entries(LIST)
  .slice(1)
  .forEach((value, key) => {
    listIndex += generateLinkText(key, value);
  });

let trendsIndex = '';
Object.entries(TRENDS)
  .slice(1)
  .forEach((value, key) => {
    trendsIndex += generateLinkText(key, value);
  });

export const TOUR_STEPS = {
  [MODE_MAP]: [
    {
      element: GEO.STEP_1.selector,
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
        geoIndex +
        '</ul></div>' +
        '</div>',
      tooltipClass: 'wide',
    },
    {
      element: GEO.STEP_2.selector,
      intro: 'These links provide more information about this database.',
    },
    {
      element: GEO.STEP_3.selector,
      intro:
        'You can change how to view complaint data by selecting the three views we have available — Trends, List, and Map.' +
        '<br /><br />' +
        'You are currently on the Map view, which displays complaints by state.' +
        '<br /><br />' +
        'To read individual complaints, select List view' +
        '<br /><br />' +
        'To visualize complaint data with product and issue breakdowns, select Trends view',
      position: 'top',
    },
    {
      element: GEO.STEP_4.selector,
      intro:
        'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.',
    },
    {
      element: GEO.STEP_5.selector,
      intro:
        'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br /> The default date range is three years from today’s date.',
    },
    {
      element: GEO.STEP_6.selector,
      intro:
        'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
        '<br /><br />' +
        'Expand a product or issue to see its sub-products or sub-issues, where available. ',
    },
    {
      element: GEO.STEP_7.selector,
      intro:
        'The blue show/hide icon allows you to expand or collapse specific filters.',
    },
    {
      element: GEO.STEP_8.selector,
      intro:
        'Use the “Search within” bar to find specific words or phrases in complaints. By default, this will search “All data”, but you can change this using the gray dropdown menu.' +
        '<br /> <br />' +
        'Click “Show advanced search tips” to see some advanced ways to refine your word search.',
    },
    {
      element: GEO.STEP_9.selector,
      intro:
        'As you apply filters and search terms, this will display how many complaints are included out of the total number of complaints published in the database.',
    },
    {
      element: GEO.STEP_10.selector,
      intro:
        'You can export full or filtered results to CSV or JSON by selecting “Export data”.',
    },
    {
      element: GEO.STEP_11.selector,
      intro: 'Select “Print” to generate a pdf of the current page.',
    },
    {
      element: GEO.STEP_12.selector,
      intro:
        'Map shading defaults to total complaints, but you can change this to show complaints per 1,000 population in that state.',
    },
    {
      element: GEO.STEP_13.selector,
      intro:
        'Hover over a tile on the map to view complaint information specific to that state. You can filter to see data specific to a state by selecting the state or using the filter panel.',
    },
    {
      element: GEO.STEP_14.selector,
      intro:
        'View complaint volume by product in the bar chart. Use the blue arrow by each product to view breakdowns by sub-products.' +
        '<br /><br />Once the product is expanded, select the “Visualize” link as shown below, to view trends on sub-products and issues:',
    },
    {
      element: GEO.STEP_15.selector,
      intro:
        'To learn how to use Trends and List views, select the view and then start the tour.',
    },
  ],
  [MODE_LIST]: [
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
        'You can change how to view complaint data by selecting the three views we have available — Trends, List, and Map.' +
        '<br /><br />' +
        'You are currently on the List view, which shows individual complaints.' +
        '<br /><br />' +
        'To visualize complaint data with product and issue breakdowns, select Trends view.' +
        '<br /><br />' +
        'To view complaints by state, select Map view.',
    },
    {
      element: LIST.STEP_4.selector,
      intro:
        'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.',
    },
    {
      element: LIST.STEP_5.selector,
      intro:
        'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br /> The default date range is three years from today’s date.',
    },
    {
      element: LIST.STEP_6.selector,
      intro:
        'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
        '<br /><br />' +
        'Expand a product or issue to see its sub-products or sub-issues, where available. ',
    },
    {
      element: LIST.STEP_7.selector,
      intro:
        'The blue show/hide icon allows you to expand or collapse specific filters.',
    },
    {
      element: LIST.STEP_8.selector,
      intro:
        'Use the “Search within” bar to find specific words or phrases in complaints. By default, this will search “All data”, but you can change this using the gray dropdown menu.' +
        '<br /> <br />' +
        'Click “Show advanced search tips” to see some advanced ways to refine your word search.',
    },
    {
      element: LIST.STEP_9.selector,
      intro:
        'As you apply filters and search terms, this will display how many complaints are included out of the total number of complaints published in the database.',
    },
    {
      element: LIST.STEP_10.selector,
      intro:
        'You can export full or filtered results to CSV or JSON by selecting “Export data”.',
    },
    {
      element: LIST.STEP_11.selector,
      intro: 'Select “Print” to generate a pdf of the current page.',
    },
    {
      element: LIST.STEP_12.selector,
      intro: 'Select the number of complaints to view per page here.',
    },
    {
      element: LIST.STEP_13.selector,
      intro:
        'Sort complaints in the list view by “Newest to oldest,” “Oldest to newest,” “Relevance,” and “Relevance (asc).”' +
        '<br /><br />' +
        'Relevancy are based on any applied search terms.',
    },
    {
      element: LIST.STEP_14.selector,
      intro:
        'You can see all complaints or focus on those with consumer complaint narratives.' +
        '<br /><br />' +
        'We publish the consumer’s narrative description of what happened from their complaint if the consumer opts to share it publicly and after taking steps to remove personal information.',
    },
    {
      element: LIST.STEP_15.selector,
      intro:
        'These are your search results. As you apply filters and search terms, your results will display here. This view shows a preview of the complaint.',
    },
    {
      element: LIST.STEP_16.selector,
      intro:
        'Click the blue ID number to see more details about a particular complaint.',
    },
    {
      element: LIST.STEP_17.selector,
      intro:
        'To learn how to use Map and Trend views, select the view and then start the tour.',
    },
  ],
  [MODE_TRENDS]: [
    {
      element: TRENDS.STEP_1.selector,
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
        trendsIndex +
        '</ul></div>' +
        '</div>',
      tooltipClass: 'wide first-step',
    },
    {
      element: TRENDS.STEP_2.selector,
      intro: 'These links provide more information about this database.',
    },
    {
      element: TRENDS.STEP_3.selector,
      intro:
        'You can change how to view complaint data by selecting the three views we have available—Trends, List, and Map.' +
        '<br /><br />' +
        'You are currently on the Trends view, which visualizes complaint data using a trend line with product and issue breakdowns.' +
        '<br /><br />' +
        'To read individual complaints, select List view.' +
        '<br /><br />' +
        'To view complaints by state, select Map view.',
      position: 'top',
    },
    {
      element: TRENDS.STEP_4.selector,
      intro:
        'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.',
    },
    {
      element: TRENDS.STEP_5.selector,
      intro:
        'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br /> The default date range is three years from today’s date.',
    },
    {
      element: TRENDS.STEP_6.selector,
      intro:
        'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
        '<br /><br />' +
        'Expand a product or issue to see its sub-products or sub-issues, where available. ',
    },
    {
      element: TRENDS.STEP_7.selector,
      intro:
        'The blue show/hide icon allows you to expand or collapse specific filters.',
    },
    {
      element: TRENDS.STEP_8.selector,
      intro:
        'Use the “Search within” bar to find specific words or phrases in complaints. By default, this will search “All data”, but you can change this using the gray dropdown menu.' +
        '<br /> <br />' +
        'Click “Show advanced search tips” to see some advanced ways to refine your word search.',
    },
    {
      element: TRENDS.STEP_9.selector,
      intro:
        'As you apply filters and search terms, this will display how many complaints are included out of the total number of complaints published in the database.',
    },
    {
      element: TRENDS.STEP_10.selector,
      intro:
        'You can export full or filtered results to CSV or JSON by selecting “Export data”.',
    },
    {
      element: TRENDS.STEP_11.selector,
      intro: 'Select “Print” to generate a pdf of the current page.',
    },
    {
      element: TRENDS.STEP_12.selector,
      intro:
        'Select the dropdown to aggregate the data by product or by the company to which the CFPB sent the complaint for response.',
    },
    {
      element: TRENDS.STEP_13.selector,
      intro:
        'Select this dropdown to change the time interval displayed on the trend line.',
    },
    {
      element: TRENDS.STEP_14.selector,
      intro:
        'View complaint volume by product in the bar chart. Use the blue arrow by each product to view breakdowns by sub-products.' +
        '<br /><br />Once the product is expanded, select the “Visualize” link as shown below, to view trends on sub-products and issues:',
    },
    {
      element: TRENDS.STEP_15.selector,
      intro:
        'To learn how to use List and Map views, select the view and then start the tour.',
      position: 'top',
    },
  ],
};
