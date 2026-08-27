import './data-export.scss';
import { getFullUrl, sendAnalyticsEvent } from '../../../utils';
import {
  buildAllResultsUri,
  buildSomeResultsUri,
  FILTER_DOWNLOAD_EMPTY_MESSAGE,
  FILTER_DOWNLOAD_LIMIT_MESSAGE,
  FILTER_DOWNLOAD_MAX,
  hasAppliedFilters,
} from './data-export-utils';
import { modalHidden, modalShown } from '../../../reducers/view/view-slice';
import { useDispatch, useSelector } from 'react-redux';
import { AlertFieldLevel, Button, Heading } from '@cfpb/design-system-react';
import { useMemo, useState } from 'react';
import { MODAL_TYPE_EXPORT_CONFIRMATION } from '../../../constants';
import { selectQueryRoot } from '../../../reducers/query/selectors';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';
import { getElementById } from '../../../utils/dom';

const DATASET_FILTERED = 'filtered';
const DATASET_FULL = 'full';

export const DataExport = () => {
  const dispatch = useDispatch();
  const queryState = useSelector(selectQueryRoot);
  const filtersState = useSelector(selectFiltersRoot);
  const { data } = useGetAggregations();
  const someComplaintsCount = data?.total || 0;
  const allComplaintsCount = data?.doc_count || 0;

  const filtersApplied = hasAppliedFilters(filtersState, queryState);
  const isOverFilterLimit = someComplaintsCount > FILTER_DOWNLOAD_MAX;
  const isFilteredDisabled = !filtersApplied || isOverFilterLimit;

  // Default to filtered results when under the limit with filters applied.
  const [dataset, setDataset] = useState(
    filtersApplied && !isOverFilterLimit ? DATASET_FILTERED : DATASET_FULL,
  );

  const [copied, setCopied] = useState(false);

  const exportDataset =
    isFilteredDisabled && dataset === DATASET_FILTERED ? DATASET_FULL : dataset;

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

  const resultsLink = useMemo(() => getFullUrl(location.href), []);

  const filterAlertMessage = filtersApplied
    ? isOverFilterLimit
      ? FILTER_DOWNLOAD_LIMIT_MESSAGE
      : null
    : FILTER_DOWNLOAD_EMPTY_MESSAGE;

  const handleExportClicked = () => {
    if (exportDataset === DATASET_FULL) {
      sendAnalyticsEvent('Export All Data', 'csv');
    } else {
      sendAnalyticsEvent('Export Some Data', 'filtered');
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

  return (
    <section className="export-modal">
      <div className="ccdb-modal__header">
        <Heading type="3">
          Download complaint data
        </Heading>
        <Button
          label="Close"
          isLink
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(modalHidden());
          }}
        />
      </div>
      <div className="ccdb-modal__body">
        <div className="export-modal__instructions">
          Download your filtered results (CSV) or download all complaint data
          (CSV ZIP). Filtered results downloads are limited to 100,000
          complaints.
        </div>
        <div className="export-modal__group">
          <Heading type="4" className="export-modal__group-title">
            Select the data you would like to download
          </Heading>
          <div>
            <div className="m-form-field m-form-field--radio m-form-field--lg-target">
              <input
                checked={exportDataset === DATASET_FILTERED}
                disabled={isFilteredDisabled}
                className="a-radio"
                id="dataset-filtered"
                onChange={() => {
                  selectDataset(DATASET_FILTERED);
                }}
                type="radio"
                value="filtered"
              />
              <label className="a-label" htmlFor="dataset-filtered">
                {'Filtered results (' +
                  someComplaintsCount.toLocaleString() +
                  ' complaints)'}
                <br />
                (limited to 100,000 complaints or fewer)
              </label>
            </div>
            <div className="m-form-field m-form-field--radio m-form-field--lg-target">
              <input
                checked={exportDataset === DATASET_FULL}
                className="a-radio"
                id="dataset-full"
                onChange={() => {
                  selectDataset(DATASET_FULL);
                }}
                type="radio"
                value="full"
              />
              <label className="a-label" htmlFor="dataset-full">
                {'All complaint data (' +
                  allComplaintsCount.toLocaleString() +
                  ' complaints)'}
                <br />
                (large, zipped CSV file of every complaint)
              </label>
            </div>
          </div>
          {filterAlertMessage ? (
            <div className="export-modal__filter-alert">
              <AlertFieldLevel message={filterAlertMessage} status="error" />
            </div>
          ) : null}
        </div>

        <div className="export-modal__url">
          <Heading type="4">Save a link to your filtered results</Heading>
          <div className="export-modal__url-control">
            <input
              className="export-modal__url-input a-text-input"
              id="export-uri-input"
              type="text"
              value={resultsLink}
              readOnly
            />
            <Button
              label={copied ? 'Link copied' : 'Copy link'}
              iconRight={copied ? 'approved' : 'link'}
              appearance="secondary"
              disabled={!resultsLink}
              onClick={copyToClipboard}
            />
          </div>
        </div>
      </div>
      <div className="ccdb-modal__footer">
        <Button
          label="Download data"
          iconRight="download"
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
