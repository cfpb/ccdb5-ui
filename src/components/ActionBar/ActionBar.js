import './ActionBar.less';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedNumber } from 'react-intl';
import getIcon from '../iconMap';
import React from 'react';
import { sendAnalyticsEvent } from '../../utils';
import { showModal } from '../../actions/view';
import { StaleDataWarnings } from '../Warnings/StaleDataWarnings';
import {
  selectAggsDocCount,
  selectAggsTotal,
} from '../../reducers/aggs/selectors';
import { selectQueryTab } from '../../reducers/query/selectors';
import { printModeOn } from '../../actions/view';
import { MODAL_TYPE_DATA_EXPORT } from '../../constants';

export const ActionBar = () => {
  const docCount = useSelector(selectAggsDocCount);
  const total = useSelector(selectAggsTotal);
  const tab = useSelector(selectQueryTab);
  const dispatch = useDispatch();

  const showPrintView = (tab) => {
    sendAnalyticsEvent('Print', 'tab:' + tab);
    dispatch(printModeOn());
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
              className="a-btn a-btn--link export-btn"
              data-gtm_ignore="true"
              onClick={() => {
                sendAnalyticsEvent('Export', tab + ':User Opens Export Modal');
                dispatch(showModal(MODAL_TYPE_DATA_EXPORT));
              }}
            >
              Export data
            </button>
            <button
              className="a-btn a-btn--link print-preview"
              onClick={() => {
                showPrintView(tab);
              }}
            >
              {getIcon('printer')}
              Print
            </button>
          </h3>
        </div>
      </summary>
      <StaleDataWarnings />
    </div>
  );
};
