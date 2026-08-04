import './data-export.scss';
import { getFullUrl, sendAnalyticsEvent } from '../../../utils';
import { buildAllResultsUri, buildSomeResultsUri } from './data-export-utils';
import { modalHidden, modalShown } from '../../../reducers/view/view-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Heading } from '@cfpb/design-system-react';
import { useMemo, useState } from 'react';
import { MODAL_TYPE_EXPORT_CONFIRMATION } from '../../../constants';
import { selectQueryRoot } from '../../../reducers/query/selectors';
import { selectViewTab } from '../../../reducers/view/selectors';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';
import { getElementById } from '../../../utils/dom';

const DATASET_FILTERED = 'filtered';
const DATASET_FULL = 'full';
const FILTER_MAX = 1e5;

export const DataExport = () => {
  const dispatch = useDispatch();
  const queryState = useSelector(selectQueryRoot);
  const filtersState = useSelector(selectFiltersRoot);
  const tab = useSelector(selectViewTab);
  const { data } = useGetAggregations();
  const someComplaintsCount = data?.total || 0;
  const allComplaintsCount = data?.doc_count || 0;
  const isFullDatasetOnly = someComplaintsCount === allComplaintsCount;

  // can only be full or filtered
  const [dataset, setDataset] = useState(
    someComplaintsCount > FILTER_MAX ? DATASET_FULL : DATASET_FILTERED,
  );

  const [copied, setCopied] = useState(false);

  const exportDataset = isFullDatasetOnly ? DATASET_FULL : dataset;

  const exportUri = useMemo(() => {
    const mergedState = {
      ...filtersState,
      ...queryState,
    };
    const url =
      exportDataset === DATASET_FULL
        ? buildAllResultsUri()
        : buildSomeResultsUri(someComplaintsCount, mergedState);
    return getFullUrl(url);
  }, [exportDataset, someComplaintsCount, filtersState, queryState]);

  const handleExportClicked = () => {
    if (exportDataset === DATASET_FULL) {
      sendAnalyticsEvent('Export All Data', tab + ':csv');
    } else {
      sendAnalyticsEvent('Export Some Data', tab);
    }

    location.assign(exportUri);
    dispatch(modalShown(MODAL_TYPE_EXPORT_CONFIRMATION));
  };

  const selectDataset = (nextDataset) => {
    setCopied(false);
    setDataset(nextDataset);
  };

  const copyToClipboard = (ev) => {
    const uriControl = getElementById('export-uri-input');
    uriControl.select();
    // For mobile devices
    uriControl.setSelectionRange(0, 99_999);
    navigator.clipboard.writeText(uriControl.value);
    ev.target.focus();

    setCopied(true);
  };

  const instructions = isFullDatasetOnly
    ? 'To download a copy of this dataset, start the export below.'
    : 'To download a copy of this dataset, choose which complaints you want to export below.';

  return (
    <section className="export-modal">
      <div className="header layout-row">
        <Heading type="3" className="flex-all">
          Export complaints
        </Heading>
        <Button
          label="Close"
          iconRight="error-round"
          isLink
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(modalHidden());
          }}
        />
      </div>
      <div className="body">
        <div className="instructions">{instructions}</div>
        {isFullDatasetOnly ? null : (
          <div className="group">
            <div className="group-title">
              Select which complaints you’d like to export
            </div>
            <div>
              <div className="m-form-field m-form-field--radio m-form-field--lg-target">
                <input
                  checked={dataset === DATASET_FILTERED}
                  disabled={someComplaintsCount > FILTER_MAX}
                  className="a-radio"
                  id="dataset-filtered"
                  onChange={() => {
                    selectDataset(DATASET_FILTERED);
                  }}
                  type="radio"
                  value="filtered"
                />
                <label className="a-label" htmlFor="dataset-filtered">
                  {'Filtered dataset (' +
                    someComplaintsCount.toLocaleString() +
                    ' complaints)'}
                  <br />
                  {someComplaintsCount > FILTER_MAX
                    ? `(limited to ${FILTER_MAX.toLocaleString()} complaints or fewer)`
                    : '(only the results of the last search and/or filter)'}
                </label>
              </div>
              <div className="m-form-field m-form-field--radio m-form-field--lg-target">
                <input
                  checked={dataset === DATASET_FULL}
                  className="a-radio"
                  id="dataset-full"
                  onChange={() => {
                    selectDataset(DATASET_FULL);
                  }}
                  type="radio"
                  value="full"
                />
                <label className="a-label" htmlFor="dataset-full">
                  {'Full dataset (' +
                    allComplaintsCount.toLocaleString() +
                    ' complaints)'}
                  <br />
                  (large, zipped CSV file of every complaint)
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="heres-the-url">
          <Heading type="4">
            Link to your complaint search results for future reference
          </Heading>
          <div className="layout-row">
            <input
              className="flex-all a-text-input"
              id="export-uri-input"
              type="text"
              value={exportUri}
              readOnly
            />
            <Button
              label={copied ? 'Copied' : 'Copy'}
              iconLeft={copied ? 'checkmark-round' : 'copy'}
              className={`a-btn ${
                copied ? 'export-url-copied' : 'a-btn__secondary'
              }`}
              disabled={!exportUri}
              onClick={copyToClipboard}
            />
          </div>
        </div>
        <div className="timeliness-warning">
          The export process could take several minutes if you’re downloading
          many complaints
        </div>
      </div>
      <div className="footer layout-row">
        <Button
          label="Start export"
          data-gtm_ignore="true"
          onClick={() => {
            handleExportClicked();
          }}
        />
        <Button
          label="Cancel"
          isLink
          appearance="warning"
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(modalHidden());
          }}
        />
      </div>
    </section>
  );
};
