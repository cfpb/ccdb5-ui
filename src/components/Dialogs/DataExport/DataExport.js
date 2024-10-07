import './DataExport.scss';
import { getFullUrl, sendAnalyticsEvent } from '../../../utils';
import { buildAllResultsUri, buildSomeResultsUri } from './dataExportUtils';
import { hideModal, showModal } from '../../../actions/view';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../../iconMap';
import { useEffect, useMemo, useState } from 'react';

import { MODAL_TYPE_EXPORT_CONFIRMATION } from '../../../constants';
import {
  selectAggsDocCount,
  selectAggsTotal,
} from '../../../reducers/aggs/selectors';
import {
  selectQueryState,
  selectQueryTab,
} from '../../../reducers/query/selectors';

const FORMAT_CSV = 'csv';
const FORMAT_JSON = 'json';

const DATASET_FILTERED = 'filtered';
const DATASET_FULL = 'full';

export const DataExport = () => {
  const dispatch = useDispatch();
  const queryState = useSelector(selectQueryState);
  const someComplaintsCount = useSelector(selectAggsTotal);
  const allComplaintsCount = useSelector(selectAggsDocCount);
  const tab = useSelector(selectQueryTab);
  // can only be full or filtered
  const [dataset, setDataset] = useState(DATASET_FULL);
  // can only be csv or json
  const [format, setFormat] = useState(FORMAT_CSV);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (someComplaintsCount === allComplaintsCount) {
      setDataset(DATASET_FULL);
    }
  }, [someComplaintsCount, allComplaintsCount]);

  const exportUri = useMemo(() => {
    const url =
      dataset === DATASET_FULL
        ? buildAllResultsUri(format)
        : buildSomeResultsUri(format, someComplaintsCount, queryState);
    return getFullUrl(url);
  }, [dataset, format, someComplaintsCount, queryState]);

  const handleExportClicked = () => {
    if (dataset === DATASET_FULL) {
      sendAnalyticsEvent('Export All Data', tab + ':' + format);
    } else {
      sendAnalyticsEvent('Export Some Data', tab + ':' + format);
    }

    window.location.assign(exportUri);
    dispatch(showModal(MODAL_TYPE_EXPORT_CONFIRMATION));
  };

  const copyToClipboard = (ev) => {
    const uriControl = document.getElementById('export-uri-input');
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
        <h3 className="flex-all">Export complaints</h3>
        <button
          className="a-btn a-btn--link"
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(hideModal());
          }}
        >
          Close
          {getIcon('delete-round')}
        </button>
      </div>
      <div className="body">
        <div className="body-copy instructions">
          To download a copy of this dataset, choose the file format and which
          complaints you want to export below.
        </div>
        <div className="group">
          <div className="group-title">
            Select a format for the exported file
          </div>
          <div className="body-copy">
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
        {someComplaintsCount === allComplaintsCount ? null : (
          <div className="group">
            <div className="group-title">
              Select which complaints you&apos;d like to export
            </div>
            <div className="body-copy">
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
          <h4>Link to your complaint search results for future reference</h4>
          <div className="layout-row">
            <input
              className="flex-all a-text-input"
              id="export-uri-input"
              type="text"
              value={exportUri}
              readOnly
            />
            <button
              className={`a-btn ${
                copied ? 'export-url-copied' : 'a-btn__secondary'
              }`}
              disabled={!exportUri}
              onClick={copyToClipboard}
            >
              {!copied && (
                <div>
                  <span className="a-btn__icon">{getIcon('copy')}</span>
                  Copy
                </div>
              )}
              {!!copied && (
                <div>
                  <span className="a-btn__icon">
                    {getIcon('checkmark-round')}
                  </span>
                  Copied
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="timeliness-warning">
          The export process could take several minutes if you&apos;re
          downloading many complaints
        </div>
      </div>
      <div className="footer layout-row">
        <button
          className="a-btn"
          data-gtm_ignore="true"
          onClick={() => {
            handleExportClicked();
          }}
        >
          Start export
        </button>
        <button
          className="a-btn a-btn--link a-btn__warning"
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(hideModal());
          }}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};
