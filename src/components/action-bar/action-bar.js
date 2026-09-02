import './action-bar.scss';
import { useDispatch } from 'react-redux';
import { Button, Heading } from '@cfpb/design-system-react';
import { sendAnalyticsEvent } from '../../utils';
import { modalShown, updatePrintModeOn } from '../../reducers/view/view-slice';
import { StaleDataWarnings } from '../warnings/stale-data-warnings';
import { MODAL_TYPE_DATA_EXPORT } from '../../constants';
import { useGetAggregations } from '../../api/hooks/use-get-aggregations';

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
      <div className="action-bar" id="search-summary">
        {total === docCount ? (
          <Heading type="3">
            {'Showing ' + docCount.toLocaleString() + ' total complaints'}
          </Heading>
        ) : (
          <Heading type="3">
            {'Showing ' +
              total.toLocaleString() +
              ' matches out of ' +
              docCount.toLocaleString() +
              ' total complaints'}
          </Heading>
        )}
        {error ? null : (
          <div className="action-bar__actions">
            <Button
              label="Export data"
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
              label="Print"
              isLink
              iconRight="print"
              className="print-preview"
              onClick={showPrintView}
            />
          </div>
        )}
      </div>
      <StaleDataWarnings />
    </>
  );
};
