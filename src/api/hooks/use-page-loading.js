import { useGetAggregations } from './use-get-aggregations';
import { useGetList } from './use-get-list';
import { useGetMap } from './use-get-map';
import { useGetTrends } from './use-get-trends';
import { isTrue } from '../../utils';

/**
 * True when aggregations or the active view's data query is loading/refetching.
 * Keeps the page overlay and related UI in sync so users cannot interact
 * (for example Export data) while counts are still resolving.
 *
 * @returns {boolean} Whether the page should show a loading state
 */
export const usePageLoading = () => {
  const { isLoading: aggsLoading, isFetching: aggsFetching } =
    useGetAggregations();
  const { isLoading: listLoading, isFetching: listFetching } = useGetList();
  const { isLoading: mapLoading, isFetching: mapFetching } = useGetMap();
  const { isLoading: trendsLoading, isFetching: trendsFetching } =
    useGetTrends();

  return isTrue([
    aggsLoading,
    aggsFetching,
    listLoading,
    listFetching,
    mapLoading,
    mapFetching,
    trendsLoading,
    trendsFetching,
  ]);
};
