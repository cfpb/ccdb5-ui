import './download-complaint-data.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AlertFieldLevel,
  ButtonGroup,
  Heading,
  Link,
  Paragraph,
  WellContainer,
} from '@cfpb/design-system-react';
import dayjs from 'dayjs';
import { DATE_RANGE_MIN } from '../../../constants';
import {
  buildAllResultsUri,
  buildSomeResultsUri,
} from '../../dialogs/data-export/data-export-utils';
import { getFullUrl, sendAnalyticsEvent } from '../../../utils';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { selectQueryRoot } from '../../../reducers/query/selectors';
import { selectViewTab } from '../../../reducers/view/selectors';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';

export const FILTER_DOWNLOAD_MAX = 1e5;
export const FILTER_DOWNLOAD_LIMIT_MESSAGE =
  'Your filtered results exceed download limits. Refine your search terms and filters to reduce the number of complaints.';
export const FILTER_DOWNLOAD_EMPTY_MESSAGE =
  'You must add search terms or apply filters to download filtered results.';
export const DOWNLOAD_STARTED_MESSAGE = 'Your data file is downloading.';

const ALERT_FADE_MS = 300;
const SUCCESS_AUTO_DISMISS_MS = 5000;

const hasAppliedFilters = (filtersState, queryState) => {
  const hasFilterValue = Object.values(filtersState).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value),
  );
  const hasSearchText = Boolean(queryState.searchText?.trim());
  const hasDateFilter =
    Boolean(queryState.date_received_min && queryState.date_received_max) &&
    (!dayjs(queryState.date_received_min).isSame(DATE_RANGE_MIN, 'day') ||
      !dayjs(queryState.date_received_max).isSame(
        queryState.dateLastIndexed,
        'day',
      ));

  return hasFilterValue || hasSearchText || hasDateFilter;
};

/**
 * List-view download well: full dataset zip + filtered CSV export.
 *
 * @returns {import('react').JSX.Element | null} Download section
 */
export const DownloadComplaintData = () => {
  const tab = useSelector(selectViewTab);
  const queryState = useSelector(selectQueryRoot);
  const filtersState = useSelector(selectFiltersRoot);
  const [alert, setAlert] = useState(null);
  const [isAlertFadingOut, setIsAlertFadingOut] = useState(false);
  const fadeTimerRef = useRef(null);
  const autoDismissTimerRef = useRef(null);
  const alertRef = useRef(null);
  const hasMountedSearchState = useRef(false);
  const { data, error } = useGetAggregations();
  const filteredCount = error ? 0 : data?.total || 0;

  useEffect(() => {
    alertRef.current = alert;
  }, [alert]);

  const clearAlertTimers = useCallback(() => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
  }, []);

  const dismissAlertWithFade = useCallback(() => {
    if (!alertRef.current || fadeTimerRef.current) {
      return;
    }
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
    setIsAlertFadingOut(true);
    fadeTimerRef.current = setTimeout(() => {
      setAlert(null);
      setIsAlertFadingOut(false);
      fadeTimerRef.current = null;
    }, ALERT_FADE_MS);
  }, []);

  const showAlert = useCallback(
    (status, message) => {
      clearAlertTimers();
      setIsAlertFadingOut(false);
      setAlert({ status, message });

      if (status === 'success') {
        autoDismissTimerRef.current = setTimeout(() => {
          dismissAlertWithFade();
        }, SUCCESS_AUTO_DISMISS_MS);
      }
    },
    [clearAlertTimers, dismissAlertWithFade],
  );

  // Dismiss the alert when filters or query change (anything that refetches results).
  useEffect(() => {
    if (!hasMountedSearchState.current) {
      hasMountedSearchState.current = true;
      return;
    }
    dismissAlertWithFade();
  }, [filtersState, queryState, dismissAlertWithFade]);

  useEffect(
    () => () => {
      clearAlertTimers();
    },
    [clearAlertTimers],
  );

  const allComplaintsUri = useMemo(
    () => getFullUrl(buildAllResultsUri('csv')),
    [],
  );

  const filteredUri = useMemo(() => {
    const mergedState = {
      ...filtersState,
      ...queryState,
    };
    return getFullUrl(buildSomeResultsUri(filteredCount, mergedState));
  }, [filtersState, queryState, filteredCount]);

  if (error) {
    return null;
  }

  return (
    <WellContainer
      className="download-complaint-data"
      data-tour="download-complaint-data"
    >
      <Heading type="3">Download complaint data</Heading>
      <Paragraph>
        Download all complaint data (CSV ZIP) or download your filtered results
        (CSV). Filtered results downloads are limited to 100,000 complaints.
      </Paragraph>
      <ButtonGroup>
        <Link
          isButton
          to={allComplaintsUri}
          label="Download all complaints"
          iconRight="download"
          className="download-all-btn"
          data-gtm_ignore="true"
          onClick={() => {
            sendAnalyticsEvent('Export All Data', tab + ':csv');
            showAlert('success', DOWNLOAD_STARTED_MESSAGE);
          }}
        />
        <Link
          isButton
          to={filteredUri}
          label="Download filtered results"
          iconRight="download"
          className="a-btn--secondary download-filtered-btn"
          data-gtm_ignore="true"
          onClick={(event) => {
            if (!hasAppliedFilters(filtersState, queryState)) {
              event.preventDefault();
              showAlert('error', FILTER_DOWNLOAD_EMPTY_MESSAGE);
              return;
            }
            if (filteredCount > FILTER_DOWNLOAD_MAX) {
              event.preventDefault();
              showAlert('error', FILTER_DOWNLOAD_LIMIT_MESSAGE);
              return;
            }
            sendAnalyticsEvent('Export Some Data', tab);
            showAlert('success', DOWNLOAD_STARTED_MESSAGE);
          }}
        />
      </ButtonGroup>
      {alert ? (
        <div
          className={
            isAlertFadingOut
              ? 'download-alert download-alert--fade-out'
              : 'download-alert'
          }
        >
          <AlertFieldLevel message={alert.message} status={alert.status} />
        </div>
      ) : null}
    </WellContainer>
  );
};
