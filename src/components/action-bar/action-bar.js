import './action-bar.scss';
import { useDispatch } from 'react-redux';
import { Alert, Button } from '@cfpb/design-system-react';
import { sendAnalyticsEvent } from '../../utils';
import { modalShown, updatePrintModeOn } from '../../reducers/view/view-slice';
import { StaleDataWarnings } from '../warnings/stale-data-warnings';
import { MODAL_TYPE_DATA_EXPORT } from '../../constants';
import { useGetAggregations } from '../../api/hooks/use-get-aggregations';

const buildSummaryMessage = (total, docCount) => {
  if (total === docCount) {
    return 'Showing ' + docCount.toLocaleString() + ' total complaints';
  }
  return (
    'Showing ' +
    total.toLocaleString() +
    ' matching results out of ' +
    docCount.toLocaleString() +
    ' total complaints'
  );
};

export const ActionBar = () => {
  const dispatch = useDispatch();
  const { data, error } = useGetAggregations();
  const docCount = error ? 0 : data?.doc_count || 0;
  const total = error ? 0 : data?.total || 0;

  const showPrintView = () => {
    sendAnalyticsEvent('Print', 'Print');
    dispatch(updatePrintModeOn());
  };

  return (
    <>
      <Alert
        id="search-summary"
        className="action-bar"
        status="success"
        message={buildSummaryMessage(total, docCount)}
      >
        {error ? null : (
          <div className="action-bar__actions">
            <Button
              label="Download data"
              isLink
              iconRight="download"
              className="export-btn"
              data-gtm_ignore="true"
              onClick={() => {
                sendAnalyticsEvent('Export', 'User Opens Export Modal');
                dispatch(modalShown(MODAL_TYPE_DATA_EXPORT));
              }}
            />
            <Button
              label="Print page"
              isLink
              iconRight="print"
              className="print-preview"
              onClick={showPrintView}
            />
          </div>
        )}
      </Alert>
      <StaleDataWarnings />
    </>
  );
};
