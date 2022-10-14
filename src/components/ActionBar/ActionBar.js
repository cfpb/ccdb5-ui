import './ActionBar.less';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedNumber } from 'react-intl';
import iconMap from '../iconMap';
import React from 'react';
import { sendAnalyticsEvent } from '../../utils';
import { showExportDialog } from '../../actions/dataExport';
import { StaleDataWarnings } from '../Warnings/StaleDataWarnings';
import {
  selectAggsDocCount,
  selectAggsTotal,
} from '../../reducers/aggs/selectors';
import { selectQueryTab } from '../../reducers/query/selectors';

export const ActionBar = () => {
  const docCount = useSelector(selectAggsDocCount);
  const total = useSelector(selectAggsTotal);
  const tab = useSelector(selectQueryTab);
  const dispatch = useDispatch();

  const showPrintView = (tab) => {
    sendAnalyticsEvent('Print', 'tab:' + tab);
    const printUrl =
      window.location.href + '&isPrintMode=true&isFromExternal=true';
    window.location.assign(printUrl);
  };
  return (
    <div>
      <summary className="action-bar" id="search-summary">
        <div>
          {total === docCount ? (
            <h2>
              Showing&nbsp;
              <FormattedNumber value={docCount} />
              &nbsp;total complaints
            </h2>
          ) : (
            <h2>
              Showing&nbsp;
              <FormattedNumber value={total} />
              &nbsp;matches out of&nbsp;
              <FormattedNumber value={docCount} />
              &nbsp;total complaints
            </h2>
          )}
        </div>
        <div>
          <h3 className="h4 flex-all export-results">
            <button
              className="a-btn a-btn__link export-btn"
              data-gtm_ignore="true"
              onClick={() => {
                sendAnalyticsEvent('Export', tab + ':User Opens Export Modal');
                dispatch(showExportDialog());
              }}
            >
              Export data
            </button>
            <button
              className="a-btn a-btn__link print-preview"
              onClick={() => {
                showPrintView(tab);
              }}
            >
              {iconMap.getIcon('printer')}
              Print
            </button>
          </h3>
        </div>
      </summary>
      <StaleDataWarnings />
    </div>
  );
};
