import './ActionBar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
import { sendAnalyticsEvent } from '../../utils';
import { modalShown, updatePrintModeOn } from '../../reducers/view/viewSlice';
import { StaleDataWarnings } from '../Warnings/StaleDataWarnings';
import { selectViewTab } from '../../reducers/view/selectors';
import { MODAL_TYPE_DATA_EXPORT } from '../../constants';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';

export const ActionBar = () => {
  const dispatch = useDispatch();
  const tab = useSelector(selectViewTab);
  const { data, error } = useGetAggregations();
  const docCount = error ? 0 : data?.doc_count || 0;
  const total = error ? 0 : data?.total || 0;

  const showPrintView = (tab) => {
    sendAnalyticsEvent('Print', 'tab:' + tab);
    dispatch(updatePrintModeOn());
  };
  return (
    <div>
      <div className="action-bar" id="search-summary">
        {total === docCount ? (
          <h2>
            {'Showing ' + docCount.toLocaleString() + ' total complaints'}
          </h2>
        ) : (
          <h2>
            {'Showing ' +
              total.toLocaleString() +
              ' matches out of ' +
              docCount.toLocaleString() +
              ' total complaints'}
          </h2>
        )}
        {error ? null : (
          <div>
            <h3 className="h4 flex-all export-results">
              <Button
                label="Export data"
                asLink
                className="export-btn"
                data-gtm_ignore="true"
                onClick={() => {
                  sendAnalyticsEvent(
                    'Export',
                    tab + ':User Opens Export Modal',
                  );
                  dispatch(modalShown(MODAL_TYPE_DATA_EXPORT));
                }}
              />
              <Button
                label="Print"
                asLink
                iconLeft="printer"
                className="print-preview"
                onClick={() => {
                  showPrintView(tab);
                }}
              />
            </h3>
          </div>
        )}
      </div>
      <StaleDataWarnings />
    </div>
  );
};
