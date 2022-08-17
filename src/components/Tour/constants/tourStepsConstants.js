import {
  MODE_DOCUMENT,
  MODE_LIST,
  MODE_MAP,
  MODE_TRENDS
} from '../../../constants';

// eslint-disable-next-line sort-imports
import {
  DOCUMENT_STEP_SELECTORS as DOCUMENT,
  GEO_STEP_SELECTORS as GEO,
  LIST_COMPLAINTS_SELECTORS as LIST,
  TRENDS_SELECTORS as TRENDS
} from './tourStepSelectors';

let geoIndex = '';
Object.entries( GEO )
  .forEach( ( v, key ) => {
    const ind = key;
    geoIndex += '<li>' +
      `<a onclick="document.querySelectorAll('.introjs-bullets li a')[${ ind }].click()">` +
      v[1].label +
      '</a>' +
      '</li>';
  } );

let listIndex = '';
Object.entries( LIST )
  .forEach( ( v, key ) => {
    const ind = key;
    listIndex += '<li>' +
      `<a onclick="document.querySelectorAll('.introjs-bullets li a')[${ ind }].click()">` +
      v[1].label +
      '</a>' +
      '</li>';
  } );

let trendsIndex = '';
Object.entries( TRENDS )
  .forEach( ( v, key ) => {
    const ind = key;
    trendsIndex += '<li>' +
      `<a onclick="document.querySelectorAll('.introjs-bullets li a')[${ ind }].click()">` +
      v[1].label +
      '</a>' +
      '</li>';
  } );


export const TOUR_STEPS = {
  [MODE_DOCUMENT]: [
    {
      element: DOCUMENT.STEP_1,
      intro:
        'Welcome to the Complaint Explorer! You can view a complaint in more detail on this page'
    },
    {
      element: DOCUMENT.STEP_2,
      intro: 'Click here to go to the next complaint in your search results'
    },
    {
      element: DOCUMENT.STEP_3,
      intro:
        'If you need to export a results set, click here. Remember exports of complaint data with PII should be stored securely on your hard drive and only shared with those who have the proper permissions.'
    },
    {
      element: DOCUMENT.STEP_4,
      intro: 'This link will take you back to the search results'
    }
  ],
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
        '<ul>' + geoIndex + '</ul></div>' +
        '</div>',
      tooltipClass: 'wide'
    },
    {
      element: GEO.STEP_2.selector,
      intro:
        'These links provide more information about this database.'
    },
    {
      element: GEO.STEP_3.selector,
      intro:
        'You can change how to view complaint data by selecting the 3 views we have available — Trends, List, and Map.' +
        '<br /><br />' +
        'You are currently on the Map view, which displays complaints by state.' +
        '<br /><br />' +
        'To visualize complaint data with product and issue breakdowns, select Trends view',
      position: 'top'
    },
    {
      element: GEO.STEP_4.selector,
      intro:
        'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.'
    },
    {
      element: GEO.STEP_5.selector,
      intro: 'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br> The default date range is 3 years from today’s date.'
    },
    {
      element: GEO.STEP_6.selector,
      intro:
        'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
        '<br><br>' +
        'Select a blue product or issue to see its sub-products or sub-issues, where available. '
    },
    {
      element: GEO.STEP_7.selector,
      intro: 'The blue show/hide icon allows you to expand or collapse specific filters.'
    },
    {
      element: GEO.STEP_8.selector,
      intro:
        'Use the “Search within” bar to find specific words or phrases in complaints. By default this will search “All data”, but you can change this using the gray dropdown menu.'
    },
    {
      element: GEO.STEP_9.selector,
      intro:
        'Not finding what you want with your keyword search? Click “Show advanced search tips” now to see some advanced ways to refine your word search.'
    },
    {
      element: GEO.STEP_10.selector,
      intro:
        'As you apply filters and search terms, this will display how many complaints are included out of the total number of complaints published in the database.'
    },
    {
      element: GEO.STEP_11.selector,
      intro: 'You can export full or filtered results to CSV or JSON by selecting “Export data”.'
    },
    {
      element: GEO.STEP_12.selector,
      intro:
        'Select “Print” to generate a pdf of the current page.'
    },
    {
      element: GEO.STEP_13.selector,
      intro:
        'Modify the data range of the complaint data shown on the map here or in the filter panel.'
    },
    {
      element: GEO.STEP_14.selector,
      intro:
        'Map shading defaults to total complaints, but you can change this to show complaints per 1,000 population in that state.'
    },
    {
      element: GEO.STEP_15.selector,
      intro:
        'Hover over a tile on the map to view complaint information specific to that state. You can filter to see data specific to a state by selecting the state or using the filter panel.'
    },
    {
      element: GEO.STEP_16.selector,
      intro:
        'To learn how to use Trends and List views, select the view and then start the tour.'
    }
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
        '<ul>' + listIndex + '</ul></div>' +
        '</div>',
      tooltipClass: 'wide'
    },
    {
      element: LIST.STEP_2.selector,
      intro:
        'These links provide more information about this database.'
    },
    {
      element: LIST.STEP_3.selector,
      intro:
        'You can change how to view complaint data by selecting the 3 views we have available — Trends, List, and Map.' +
        '<br /><br />' +
        'You are currently on the List view, which shows individual complaints.' +
        '<br /><br />' +
        'To visualize complaint data with product and issue breakdowns , select Trends view.'
    },
    {
      element: LIST.STEP_4.selector,
      intro:
        'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.'
    },
    {
      element: LIST.STEP_5.selector,
      intro: 'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br> The default date range is 3 years from today’s date.'
    },
    {
      element: LIST.STEP_6.selector,
      intro:
        'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
        '<br><br>' +
        'Select a blue product or issue to see its sub-products or sub-issues, where available. '
    },
    {
      element: LIST.STEP_7.selector,
      intro: 'The blue show/hide icon allows you to expand or collapse specific filters.'
    },
    {
      element: LIST.STEP_8.selector,
      intro:
        'Use the “Search within” bar to find specific words or phrases in complaints. By default this will search “All data”, but you can change this using the gray dropdown menu.'
    },
    {
      element: LIST.STEP_9.selector,
      intro:
        'Not finding what you want with your keyword search? Click “Show advanced search tips” now to see some advanced ways to refine your word search.'
    },
    {
      element: LIST.STEP_10.selector,
      intro:
        'As you apply filters and search terms, this will display how many complaints are included out of the total number of complaints published in the database.'
    },
    {
      element: LIST.STEP_11.selector,
      intro: 'You can export full or filtered results to CSV or JSON by selecting “Export data”.'
    },
    {
      element: LIST.STEP_12.selector,
      intro:
        'Select “Print” to generate a pdf of the current page.'
    },
    {
      element: LIST.STEP_13.selector,
      intro:
        'Select the number of complaints to view per page here.'
    },
    {
      element: LIST.STEP_14.selector,
      intro:
        'Sort complaints in the list view by “Newest to oldest,” “Oldest to newest,” “Relevance,” and “Relevance (asc).”' +
        '<br><br>' +
        'Relevancy are based on any applied search terms.'
    },
    {
      element: LIST.STEP_15.selector,
      intro:
        'You can see all complaints or focus on those with consumer complaint narratives.' +
        '<br><br>' +
        'We publish the consumer’s narrative description of what happened from their complaint if the consumer opts to share it publicly and after taking steps to remove personal information.'
    },
    {
      element: LIST.STEP_16.selector,
      intro:
        'These are your search results. As you apply filters and search terms, your results will display here. This view shows a preview of the complaint.'
    },
    {
      element: LIST.STEP_17.selector,
      intro:
        'Click the blue ID number to see more details about a particular complaint.'
    },
    {
      element: LIST.STEP_18.selector,
      intro:
        'To learn how to use Map and Trend views, select the view and then start the tour.'
    }
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
        '<ul>' + trendsIndex + '</ul></div>' +
        '</div>',
      tooltipClass: 'wide'
    },
    {
      element: TRENDS.STEP_2.selector,
      intro:
        'These links provide more information about this database.'
    },
    {
      element: TRENDS.STEP_3.selector,
      intro:
        'You can change how to view complaint data by selecting the 3 views we have available—Trends, List, and Map.' +
        '<br /><br />' +
        'You are currently on the List view, which visualizes complaint data using a trend line with product and issue breakdowns.' +
        '<br /><br />' +
        'To read individual complaints, select List view.' +
        '<br /><br />' +
        'To view complaints by state, select Map view.',
      position: 'top'
    },
    {
      element: TRENDS.STEP_4.selector,
      intro:
        'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.'
    },
    {
      element: TRENDS.STEP_5.selector,
      intro: 'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br> The default date range is 3 years from today’s date.'
    },
    {
      element: TRENDS.STEP_6.selector,
      intro:
        'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
        '<br><br>' +
        'Select a blue product or issue to see its sub-products or sub-issues, where available. '
    },
    {
      element: TRENDS.STEP_7.selector,
      intro: 'The blue show/hide icon allows you to expand or collapse specific filters.'
    },
    {
      element: TRENDS.STEP_8.selector,
      intro:
        'Use the “Search within” bar to find specific words or phrases in complaints. By default this will search “All data”, but you can change this using the gray dropdown menu.'
    },
    {
      element: TRENDS.STEP_9.selector,
      intro:
        'Not finding what you want with your keyword search? Click “Show advanced search tips” now to see some advanced ways to refine your word search.'
    },
    {
      element: TRENDS.STEP_10.selector,
      intro:
        'As you apply filters and search terms, this will display how many complaints are included out of the total number of complaints published in the database.'
    },
    {
      element: TRENDS.STEP_11.selector,
      intro: 'You can export full or filtered results to CSV or JSON by selecting “Export data”.'
    },
    {
      element: TRENDS.STEP_12.selector,
      intro:
        'Select “Print” to generate a pdf of the current page.'
    },
    {
      element: TRENDS.STEP_13.selector,
      intro:
        'Select the dropdown to aggregate the data by product or by the company to which the CFPB sent the complaint for response.'
    },
    {
      element: TRENDS.STEP_14.selector,
      intro:
        'Select this dropdown to change the time interval displayed on the trend line.'
    },
    {
      element: TRENDS.STEP_15.selector,
      intro:
        'Modify date range shown in trends chart here or in the filter panel.'
    },
    {
      element: TRENDS.STEP_16.selector,
      intro:
        'View complaint volume by product in the bar chart. Use the blue arrow by each product to view breakdowns by sub-products.' +
        '<br><br>Once the product is expanded, select the “Visualize” link as shown below, to view trends on sub-products and issues:'
    },
    {
      element: TRENDS.STEP_17.selector,
      intro:
        'To learn how to use List and Map views, select the view and then start the tour.',
      position: 'top'
    }
  ]
};
