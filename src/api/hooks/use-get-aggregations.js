import { useGetAggregationsQuery } from '../complaints';
import { useSelector } from 'react-redux';
import { extractAggregationParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import {
  selectQueryDateLastIndexed,
  selectQueryRoot,
} from '../../reducers/query/selectors';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';
import { isTrue } from '../../utils';

export const useGetAggregations = () => {
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const qs = useSelector(selectRoutesQueryString);
  const dateLastIndexed = useSelector(selectQueryDateLastIndexed);
  const queryParams = extractAggregationParams(filters, query);
  const shouldSkip = isTrue([!dateLastIndexed, qs === '']);
  return useGetAggregationsQuery(queryParams, {
    skip: shouldSkip,
  });
};
