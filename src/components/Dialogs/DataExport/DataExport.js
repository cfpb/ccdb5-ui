import './DataExport.scss';
import { getFullUrl, sendAnalyticsEvent } from '../../../utils';
import {
  buildAllResultsUri,
  buildMonthlyExportUrls,
  buildSomeResultsUri,
  downloadExportFile,
} from './dataExportUtils';
import { modalHidden, modalShown } from '../../../reducers/view/viewSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Heading,
  List,
  ListItem,
  Paragraph,
  RadioButton,
  TextInput,
} from '@cfpb/design-system-react';
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

const FormatOptions = ({ format, onChange }) => (
  <Fieldset legend="Select a format for the exported file">
    <RadioButton
      checked={format === FORMAT_CSV}
      id="format_csv"
      isLarge
      label="CSV"
      name="export_format"
      onChange={() => onChange(FORMAT_CSV)}
      type="radio"
      value="csv"
    />
    <RadioButton
      checked={format === FORMAT_JSON}
      id="format_json"
      isLarge
      label="JSON"
      name="export_format"
      onChange={() => onChange(FORMAT_JSON)}
      type="radio"
      value="json"
    />
  </Fieldset>
);

export const DataExport = () => {
  const dispatch = useDispatch();
  const queryState = useSelector(selectQueryRoot);
  const filtersState = useSelector(selectFiltersRoot);
  const tab = useSelector(selectViewTab);
  const { data } = useGetAggregations();
  const someComplaintsCount = data?.total || 0;
  const allComplaintsCount = data?.doc_count || 0;
  const isFullDatasetOnly = someComplaintsCount === allComplaintsCount;

  const [dataset, setDataset] = useState(DATASET_FULL);
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

  const handleFormatChange = (nextFormat) => {
    setCopied(false);
    setFormat(nextFormat);
  };

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
    uriControl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(uriControl.value);
    ev.target.focus();

    setCopied(true);
  };

  const tabButtonClassName = (tabName) =>
    `export-tab${activeTab === tabName ? ' selected' : ''}`;

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
        <ButtonGroup className="m-btn-group export-tabs">
          <Button
            label="Export"
            className={tabButtonClassName(TAB_EXPORT)}
            onClick={() => setActiveTab(TAB_EXPORT)}
          />
          <Button
            label="Download"
            className={tabButtonClassName(TAB_DOWNLOAD)}
            onClick={() => setActiveTab(TAB_DOWNLOAD)}
          />
        </ButtonGroup>

        <FormatOptions format={format} onChange={handleFormatChange} />

        {activeTab === TAB_EXPORT ? (
          <>
            <Paragraph className="instructions">
              To download a copy of this dataset, choose the file format and
              which complaints you want to export below.
            </Paragraph>

            {!isFullDatasetOnly ? (
              <Fieldset legend="Select which complaints you’d like to export">
                <RadioButton
                  checked={dataset === DATASET_FILTERED}
                  id="dataset_filtered"
                  isLarge
                  label={
                    <>
                      {`Filtered dataset (${someComplaintsCount.toLocaleString()} complaints)`}
                      <br />
                      (only the results of the last search and/or filter)
                    </>
                  }
                  name="export_dataset"
                  onChange={() => {
                    setCopied(false);
                    setDataset(DATASET_FILTERED);
                  }}
                  type="radio"
                  value="filtered"
                />
                <RadioButton
                  checked={dataset === DATASET_FULL}
                  id="dataset_full"
                  isLarge
                  label={
                    <>
                      {`Full dataset (${allComplaintsCount.toLocaleString()} complaints)`}
                      <br />
                      (not recommended due to very large file size)
                    </>
                  }
                  name="export_dataset"
                  onChange={() => {
                    setCopied(false);
                    setDataset(DATASET_FULL);
                  }}
                  type="radio"
                  value="full"
                />
              </Fieldset>
            ) : null}

            <div className="heres-the-url">
              <Heading type="4">
                Link to your complaint search results for future reference
              </Heading>
              <div className="layout-row">
                <TextInput
                  className="flex-all"
                  id="export-uri-input"
                  isFullWidth
                  name="export-uri"
                  readOnly
                  value={exportUri}
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

            <Paragraph className="timeliness-warning">
              The export process could take several minutes if you’re downloading
              many complaints
            </Paragraph>
          </>
        ) : (
          <div className="monthly-download">
            <Paragraph className="instructions">
              Proof of concept: download your export in smaller monthly chunks
              to avoid timeouts on very large date ranges. Each link uses the
              same search and filter parameters as your current view, with only
              the date range adjusted per month.
            </Paragraph>

            {monthlyExportUrls.length === 0 ? (
              <Paragraph className="monthly-download-empty">
                Unable to determine a date range for monthly downloads.
              </Paragraph>
            ) : (
              <Fieldset
                legend={`Monthly download links (${monthlyExportUrls.length})`}
              >
                <List isUnstyled className="monthly-download-list">
                  {monthlyExportUrls.map(({ label, uri, filename }) => (
                    <ListItem key={`${filename}-${uri}`}>
                      <Button
                        isLink
                        iconLeft="download"
                        label={label}
                        onClick={() => downloadExportFile(uri, filename)}
                      />
                      <Paragraph className="monthly-download-filename a-micro-copy">
                        {filename}
                      </Paragraph>
                    </ListItem>
                  ))}
                </List>
              </Fieldset>
            )}
          </div>
        )}
      </div>
      <div className="footer layout-row">
        {activeTab === TAB_EXPORT ? (
          <Button
            label="Start export"
            data-gtm_ignore="true"
            onClick={handleExportClicked}
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
