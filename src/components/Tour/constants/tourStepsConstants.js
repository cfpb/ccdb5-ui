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
      element: GEO.STEP_1,
      intro:
        'Welcome to the Complaint Explorer Map feature! Click “Next” to learn about the tool’s major features.'
    },
    {
      element: GEO.STEP_2,
      intro:
        'This view provides the ability to view complaint data geographically.'
    },
    {
      element: GEO.STEP_3,
      intro:
        'Display complaints in a user-friendly state tile map or in a geographic map.'
    },
    {
      element: GEO.STEP_4,
      intro:
        'Change the geographical boundaries of the map by selecting these geographical filters.'
    },
    {
      element: GEO.STEP_5,
      intro:
        'Expand "Map options" to change the shading or features displayed on the map.'
    },
    {
      element: GEO.STEP_6,
      intro:
        'Allows you to type in a geographic area to zoom and center the map on.'
    },

    /*
   //TODO: Remove comments when export feature is implemented
    {
      element: GEO.STEP_7,
      intro: 'To export the map as an image, select the “Export map” feature.',
    },
    */
    {
      element: GEO.STEP_8,
      intro: 'Select ‘Reset map’ to return map to the original view'
    },
    {
      element: GEO.STEP_9,
      intro:
        'To see different views of complaint data, you can use the List, Map, or Trends views.'
    },
    {
      element: GEO.STEP_10,
      intro: 'To view a list of complaints click the List Tab'
    },
    {
      element: GEO.STEP_11,
      intro:
        'The trends tab presents a visual view of complaints over time. You can adjust the period and time frame for these trends, as well as add filters or search criteria to update the charts.'
    },
    {
      element: GEO.STEP_12,
      intro:
        'The Compare tab presents a visual view of complaints over time. You can adjust the period and time frame for these trends, as well as add filters or search criteria to update the charts.'
    }
  ],
  [MODE_LIST]: [
    {
      element: LIST.STEP_1,
      intro:
        'Welcome to the Complaint Explorer! Click “Next” to learn about the tool’s major features.'
    },
    {
      element: LIST.STEP_2,
      intro:
        'The “Filter results by” panel lets you filter complaints. Mouse over each filter title to get more information on the data behind each filter.'
    },
    {
      element: LIST.STEP_3,
      intro:
        'Use the “Search Within” bar to find specific words or phrases in a complaint. By default you will search complaint narratives, but you can change that using the drop-down menu.'
    },
    {
      element: LIST.STEP_4,
      intro:
        'Not finding what you want with your keyword search? Click “Show Tips” now to see some advanced ways to refine your word search.'
    },
    {
      element: LIST.STEP_5,
      intro: 'Select the number of complaints to view per page here'
    },
    {
      element: LIST.STEP_6,
      intro:
        'Sort complaints in the list view by “Newest to Oldest,” “Oldest to Newest,” “Most Relevant,” and “Least Relevant.”'
    },
    {
      element: LIST.STEP_7,
      intro:
        'These are your search results. Click the blue number to see more detail about a particular complaint, and the bookmark icon to add the complaint to your “selected” results set.'
    },
    {
      element: LIST.STEP_8,
      intro:
        'Happy with the search you’ve crafted? Click here to save that search so you can run it again later. It will appear on your homepage in “My Explorer”.'
    },
    {
      element: LIST.STEP_9,
      intro:
        'Quickly view and access previous searches, exports and downloads by selecting “My Explorer”.'
    },
    // TODO: MLT
    // {
    //   element: LIST.STEP_10,
    //   intro:
    //     'More Like This: Click here to show other complaints with similar narratives based on a complex vector proximity algorithm currently handled by Elasticsearch.',
    // },
    {
      element: LIST.STEP_11,
      intro:
        'Add specific complaint cases to be exported by selecting the “Add to selection” button.'
    },
    {
      element: LIST.STEP_12,
      intro:
        'Add all visible search results on this page to your “selected” set by clicking "Add Shown to Selected."'
    },
    {
      element: LIST.STEP_13,
      intro:
        'Finally, if you need to export a results set, click here. Remember exports of complaint data with PII should be stored securely on your hard drive and only shared with those who have the proper permissions.'
    },
    {
      element: LIST.STEP_14,
      intro:
        'To see different views of complaint data, you can use the Map, Trends, or Compare views.'
    },
    {
      element: LIST.STEP_15,
      intro:
        'To view complaints by different groupings and background data, click the Map tab. The map will incorporate any filters you select, and will remove an unmappable records without the appropriate coordinates.'
    },
    {
      element: LIST.STEP_16,
      intro:
        'The Trends tab presents a visual view of complaints over time. You can adjust the period and time frame for these trends, as well as add filters or search criteria to update the charts.'
    },
    {
      element: LIST.STEP_17,
      intro:
        'The Compare tab presents a visual view of complaints over time. You can adjust the period and time frame for these trends, as well as add filters or search criteria to update the charts.'
    }
  ],
  [MODE_TRENDS]: [
    {
      element: TRENDS.STEP_1,
      intro:
        'Welcome to the Consumer Complaint Database!' +
        '<br /><br />' +
        'Complaints the CFPB sends to companies for response are published in the Consumer Complaint Database after the company responds, confirming a commercial relationship with the consumer, or after 15 days, whichever comes first.' +
        '<br /><br />' +
        'Complaints the CFPB refers to other regulators, such as complaints about depository institutions with less than $10 billion in assets, are not published in the database. This database is not a statistical sample of consumers’ experiences in the marketplace. ',
      tooltipClass: 'wide'
    },
    {
      element: TRENDS.STEP_2,
      intro:
        'These links provide more information about this database.'
    },
    {
      element: TRENDS.STEP_3,
      intro:
        'You can change how to view complaint data by selecting the 3 views we have available—Trends, List, and Map.\n' +
        '<br /><br />' +
        'You are currently on the Trends view, which visualizes complaint data using a trend line with product and issue breakdowns.\n' +
        '<br /><br />' +
        'To read individual complaints, select List view.' +
        '<br /><br />' +
        'To view complaints by state, select Map view.',
      position: 'top'
    },
    {
      element: TRENDS.STEP_4,
      intro:
        'The “Filter results by” panel lets you filter complaint data. To clear filters, uncheck individual selections in the filter panel or to select “Clear all filters” under the Search bar.'
    },

    {
      element: TRENDS.STEP_5,
      intro: 'You can adjust the date range of the complaint data showed using the “Date CFPB received the complaint” filter. <br> The default date range is 3 years from today’s date.'
    },

    {
      element: TRENDS.STEP_6,
      intro:
        'You can filter complaints by the product and issue the consumer selected when they submitted their complaint.' +
        '<br><br>' +
        'Select a blue product or issue to see its sub-products or sub-issues, where available. '
    },
    {
      element: TRENDS.STEP_7,
      intro: 'The blue show/hide icon allows you to expand or collapse specific filters.'
    },
    {
      element: TRENDS.STEP_8,
      intro:
        'Use the “Search within” bar to find specific words or phrases in complaints. By default this will search “All data”, but you can change this using the gray dropdown menu.'
    },
    {
      element: TRENDS.STEP_9,
      intro:
        'Not finding what you want with your keyword search? Click “Show advanced search tips” now to see some advanced ways to refine your word search.'
    },
    {
      element: '.search-tips-toggle-container > button',
      intro:
        'Not finding what you want with your keyword search? Click “Show search tips” to see some advanced ways to refine your word search.'
    },
    {
      element: TRENDS.STEP_10,
      intro:
        'To see different views of complaint data, you can use the List, Map or Compare views.'
    },
    {
      element: TRENDS.STEP_11,
      intro: 'To view a list of complaints click the List Tab'
    },
    {
      element: TRENDS.STEP_12,
      intro:
        'To view complaints by different groupings and background data, click the Map tab. The map will incorporate any filters you select, and will remove an unmappable records without the appropriate coordinates.'
    },
    {
      element: TRENDS.STEP_13,
      intro:
        'The Compare tab presents a visual view of complaints over time. You can adjust the period and time frame for these trends, as well as add filters or search criteria to update the charts.'
    }
  ]
};
