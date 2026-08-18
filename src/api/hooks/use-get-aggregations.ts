import { useGetAggregationsQuery } from '../complaints';
import { extractAggregationParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import {
  selectQueryDateLastIndexed,
  selectQueryRoot,
} from '../../reducers/query/selectors';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';
import { isTrue } from '../../utils';
import { useAppSelector } from '../../app/hooks';

export const useGetAggregations = () => {
  const filters = useAppSelector(selectFiltersRoot);
  const query = useAppSelector(selectQueryRoot);
  const qs = useAppSelector(selectRoutesQueryString);
  const dateLastIndexed = useAppSelector(selectQueryDateLastIndexed);
  const queryParams = extractAggregationParams(filters, query);
  const shouldSkip = isTrue([!dateLastIndexed, qs === '']);
  return useGetAggregationsQuery(queryParams, {
    skip: shouldSkip,
  });
};
