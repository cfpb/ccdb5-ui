import './ActionBar.scss';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../Common/Icon/iconMap';
import { sendAnalyticsEvent } from '../../utils';
import { modalShown, updatePrintModeOn } from '../../reducers/view/viewSlice';
import { StaleDataWarnings } from '../Warnings/StaleDataWarnings';
import { selectViewTab } from '../../reducers/view/selectors';
import { MODAL_TYPE_DATA_EXPORT } from '../../constants';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';

export const ActionBar = () => {
  const dispatch = useDispatch();
  const tab = useSelector(selectViewTab);
  const { data } = useGetAggregations();
  const docCount = data?.doc_count || 0;
  const total = data?.total || 0;

  const showPrintView = (tab) => {
    sendAnalyticsEvent('Print', 'tab:' + tab);
    dispatch(updatePrintModeOn());
  };
  return (
    <div>
      <summary className="action-bar" id="search-summary">
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
        <div>
          <h3 className="h4 flex-all export-results">
            <button
              className="a-btn a-btn--link export-btn"
              data-gtm_ignore="true"
              onClick={() => {
                sendAnalyticsEvent('Export', tab + ':User Opens Export Modal');
                dispatch(modalShown(MODAL_TYPE_DATA_EXPORT));
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
