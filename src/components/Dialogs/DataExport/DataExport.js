import './DataExport.scss';
import { getFullUrl, sendAnalyticsEvent } from '../../../utils';
import { buildAllResultsUri, buildMonthlyExportUrls, buildSomeResultsUri, downloadExportFile } from './dataExportUtils';
import { modalHidden, modalShown } from '../../../reducers/view/viewSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Heading } from '@cfpb/design-system-react';
import { useMemo, useState } from 'react';
import { MODAL_TYPE_EXPORT_CONFIRMATION } from '../../../constants';
import { selectQueryRoot } from '../../../reducers/query/selectors';
import { selectViewTab } from '../../../reducers/view/selectors';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { getElementById } from '../../../utils/dom';

const FORMAT_CSV = 'csv';
const FORMAT_JSON = 'json';

const DATASET_FILTERED = 'filtered';
const DATASET_FULL = 'full';

const TAB_EXPORT = 'export';
const TAB_DOWNLOAD = 'download';

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
  const [dataset, setDataset] = useState(DATASET_FULL);
  // can only be csv or json
  const [format, setFormat] = useState(FORMAT_CSV);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_EXPORT);

  const mergedState = useMemo(
    () => ({
      ...filtersState,
      ...queryState,
    }),
    [filtersState, queryState],
  );

  const exportDataset = isFullDatasetOnly ? DATASET_FULL : dataset;

  const exportUri = useMemo(() => {
    const url =
      exportDataset === DATASET_FULL
        ? buildAllResultsUri(format)
        : buildSomeResultsUri(format, someComplaintsCount, mergedState);
    return getFullUrl(url);
  }, [exportDataset, format, someComplaintsCount, mergedState]);

  const exportSize = isFullDatasetOnly
    ? allComplaintsCount
    : someComplaintsCount;

  const monthlyExportUrls = useMemo(() => {
    return buildMonthlyExportUrls(format, exportSize, mergedState).map(
      ({ label, uri, filename }) => ({
        label,
        filename,
        uri: getFullUrl(uri),
      }),
    );
  }, [exportSize, format, mergedState]);

  const handleExportClicked = () => {
    if (exportDataset === DATASET_FULL) {
      sendAnalyticsEvent('Export All Data', tab + ':' + format);
    } else {
      sendAnalyticsEvent('Export Some Data', tab + ':' + format);
    }

    window.location.assign(exportUri);
    dispatch(modalShown(MODAL_TYPE_EXPORT_CONFIRMATION));
  };

  const copyToClipboard = (ev) => {
    const uriControl = getElementById('export-uri-input');
    uriControl.select();
    // For mobile devices
    uriControl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(uriControl.value);
    ev.target.focus();

    setCopied(true);
  };
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
        <div className="export-tabs">
          <button
            type="button"
            className={`export-tab ${activeTab === TAB_EXPORT ? 'active' : ''}`}
            onClick={() => setActiveTab(TAB_EXPORT)}
          >
            Export
          </button>
          <button
            type="button"
            className={`export-tab ${activeTab === TAB_DOWNLOAD ? 'active' : ''}`}
            onClick={() => setActiveTab(TAB_DOWNLOAD)}
          >
            Download
          </button>
        </div>
        {activeTab === TAB_EXPORT ? (
          <>
        <div className="instructions">
          To download a copy of this dataset, choose the file format and which
          complaints you want to export below.
        </div>
        <div className="group">
          <div className="group-title">
            Select a format for the exported file
          </div>
          <div>
            <div className="m-form-field m-form-field--radio m-form-field--lg-target">
              <input
                checked={format === FORMAT_CSV}
                className="a-radio"
                id="format_csv"
                onChange={() => {
                  setCopied(false);
                  setFormat(FORMAT_CSV);
                }}
                type="radio"
                value="csv"
              />
              <label className="a-label" htmlFor="format_csv">
                CSV
              </label>
            </div>
            <div className="m-form-field m-form-field--radio m-form-field--lg-target">
              <input
                checked={format === FORMAT_JSON}
                className="a-radio"
                id="format_json"
                onChange={() => {
                  setCopied(false);
                  setFormat(FORMAT_JSON);
                }}
                type="radio"
                value="json"
              />
              <label className="a-label" htmlFor="format_json">
                JSON
              </label>
            </div>
          </div>
        </div>
        {isFullDatasetOnly ? null : (
          <div className="group">
            <div className="group-title">
              Select which complaints you’d like to export
            </div>
            <div>
              <div className="m-form-field m-form-field--radio m-form-field--lg-target">
                <input
                  checked={dataset === DATASET_FILTERED}
                  className="a-radio"
                  id="dataset_filtered"
                  onChange={() => {
                    setCopied(false);
                    setDataset(DATASET_FILTERED);
                  }}
                  type="radio"
                  value="filtered"
                />
                <label className="a-label" htmlFor="dataset_filtered">
                  {'Filtered dataset (' +
                    someComplaintsCount.toLocaleString() +
                    ' complaints)'}
                  <br />
                  (only the results of the last search and/or filter)
                </label>
              </div>
              <div className="m-form-field m-form-field--radio m-form-field--lg-target">
                <input
                  checked={dataset === DATASET_FULL}
                  className="a-radio"
                  id="dataset_full"
                  onChange={() => {
                    setCopied(false);
                    setDataset(DATASET_FULL);
                  }}
                  type="radio"
                  value="full"
                />
                <label className="a-label" htmlFor="dataset_full">
                  {'Full dataset (' +
                    allComplaintsCount.toLocaleString() +
                    ' complaints)'}
                  <br />
                  (not recommended due to very large file size)
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
          </>
        ) : (
          <div className="monthly-download">
            <div className="instructions">
              Proof of concept: download your export in smaller monthly chunks
              to avoid timeouts on very large date ranges. Each link uses the
              same search and filter parameters as your current view, with only
              the date range adjusted per month.
            </div>
            {monthlyExportUrls.length === 0 ? (
              <p className="monthly-download-empty">
                Unable to determine a date range for monthly downloads.
              </p>
            ) : (
              <>
                <div className="group">
                  <div className="group-title">
                    Select a format for the exported file
                  </div>
                  <div>
                    <div className="m-form-field m-form-field--radio m-form-field--lg-target">
                      <input
                        checked={format === FORMAT_CSV}
                        className="a-radio"
                        id="download_format_csv"
                        onChange={() => setFormat(FORMAT_CSV)}
                        type="radio"
                        value="csv"
                      />
                      <label className="a-label" htmlFor="download_format_csv">
                        CSV
                      </label>
                    </div>
                    <div className="m-form-field m-form-field--radio m-form-field--lg-target">
                      <input
                        checked={format === FORMAT_JSON}
                        className="a-radio"
                        id="download_format_json"
                        onChange={() => setFormat(FORMAT_JSON)}
                        type="radio"
                        value="json"
                      />
                      <label className="a-label" htmlFor="download_format_json">
                        JSON
                      </label>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="group-title">
                    Monthly download links ({monthlyExportUrls.length})
                  </div>
                  <ul className="monthly-download-list">
                    {monthlyExportUrls.map(({ label, uri, filename }) => (
                      <li key={`${filename}-${uri}`}>
                        <button
                          type="button"
                          className="monthly-download-link"
                          onClick={() => downloadExportFile(uri, filename)}
                        >
                          {label}
                        </button>
                        <span className="monthly-download-filename">
                          {filename}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="footer layout-row">
        {activeTab === TAB_EXPORT ? (
        <Button
          label="Start export"
          data-gtm_ignore="true"
          onClick={() => {
            handleExportClicked();
          }}
        />
        ) : null}
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
