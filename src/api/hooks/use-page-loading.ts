import { useGetAggregations } from './use-get-aggregations';
import { useGetList } from './use-get-list';
import { isTrue } from '../../utils';

/**
 * True when aggregations or list data is loading/refetching.
 * Keeps the page overlay and related UI in sync so users cannot interact
 * (for example Export data) while counts are still resolving.
 *
 * @returns Whether the page should show a loading state.
 */
// eslint-disable-next-line unicorn/consistent-boolean-name -- established hook name
export const usePageLoading = (): boolean => {
  const { isLoading: aggsLoading, isFetching: aggsFetching } =
    useGetAggregations();
  const { isLoading: listLoading, isFetching: listFetching } = useGetList();

  return isTrue([aggsLoading, aggsFetching, listLoading, listFetching]);
};
