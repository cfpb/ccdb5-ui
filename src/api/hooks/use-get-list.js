import { useGetListQuery } from '../complaints';
import { useSelector } from 'react-redux';
import { extractBasicParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import {
  selectQueryDateLastIndexed,
  selectQueryRoot,
} from '../../reducers/query/selectors';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';
import { isTrue } from '../../utils';

export const useGetList = () => {
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const qs = useSelector(selectRoutesQueryString);
  const queryParams = extractBasicParams(filters, query);
  const dateLastIndexed = useSelector(selectQueryDateLastIndexed);
  const shouldSkip = isTrue([qs === '', !dateLastIndexed]);
  return useGetListQuery(queryParams, {
    skip: shouldSkip,
  });
};
