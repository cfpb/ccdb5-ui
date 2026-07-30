import { useGetMapQuery } from '../complaints';
import { useSelector } from 'react-redux';
import { extractAggregationParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import {
  selectQueryDateLastIndexed,
  selectQueryRoot,
} from '../../reducers/query/selectors';
import { selectViewTab } from '../../reducers/view/selectors';
import { MODE_MAP } from '../../constants';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';
import { isTrue } from '../../utils';

export const useGetMap = () => {
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const tab = useSelector(selectViewTab);
  const qs = useSelector(selectRoutesQueryString);
  const dateLastIndexed = useSelector(selectQueryDateLastIndexed);
  const shouldSkip = isTrue([!dateLastIndexed, tab !== MODE_MAP, qs === '']);
  const queryParams = extractAggregationParams(filters, query);
  return useGetMapQuery(queryParams, {
    skip: shouldSkip,
  });
};
