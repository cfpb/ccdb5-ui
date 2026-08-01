import './download-complaint-data.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AlertFieldLevel,
  ButtonGroup,
  Heading,
  Link,
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
  'You must add search terms or apply filters to create and download a filtered results dataset.';

const ALERT_FADE_MS = 300;

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
  const [filteredDownloadError, setFilteredDownloadError] = useState('');
  const [isAlertFadingOut, setIsAlertFadingOut] = useState(false);
  const fadeTimerRef = useRef(null);
  const filteredDownloadErrorRef = useRef('');
  const hasMountedSearchState = useRef(false);
  const { data, error } = useGetAggregations();
  const filteredCount = error ? 0 : data?.total || 0;

  useEffect(() => {
    filteredDownloadErrorRef.current = filteredDownloadError;
  }, [filteredDownloadError]);

  const dismissErrorWithFade = useCallback(() => {
    if (!filteredDownloadErrorRef.current || fadeTimerRef.current) {
      return;
    }
    setIsAlertFadingOut(true);
    fadeTimerRef.current = setTimeout(() => {
      setFilteredDownloadError('');
      setIsAlertFadingOut(false);
      fadeTimerRef.current = null;
    }, ALERT_FADE_MS);
  }, []);

  // Dismiss the alert when filters or query change (anything that refetches results).
  useEffect(() => {
    if (!hasMountedSearchState.current) {
      hasMountedSearchState.current = true;
      return;
    }
    dismissErrorWithFade();
  }, [filtersState, queryState, dismissErrorWithFade]);

  useEffect(
    () => () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    },
    [],
  );

  const showFilteredDownloadError = (message) => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    setIsAlertFadingOut(false);
    setFilteredDownloadError(message);
  };

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
      <Heading type="4">Download complaint data</Heading>
      <p>
        Download all complaint data or download a subset of the data by
        filtering the full dataset and downloading your results. For filtered
        results, downloads are limited to 100,000 complaints.
      </p>
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
              showFilteredDownloadError(FILTER_DOWNLOAD_EMPTY_MESSAGE);
              return;
            }
            if (filteredCount > FILTER_DOWNLOAD_MAX) {
              event.preventDefault();
              showFilteredDownloadError(FILTER_DOWNLOAD_LIMIT_MESSAGE);
              return;
            }
            showFilteredDownloadError('');
            sendAnalyticsEvent('Export Some Data', tab);
          }}
        />
      </ButtonGroup>
      {filteredDownloadError ? (
        <div
          className={
            isAlertFadingOut
              ? 'download-alert download-alert--fade-out'
              : 'download-alert'
          }
        >
          <AlertFieldLevel message={filteredDownloadError} status="error" />
        </div>
      ) : null}
    </WellContainer>
  );
};
