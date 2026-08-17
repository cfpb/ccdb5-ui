import { useGetListQuery } from '../complaints';
import { extractBasicParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import {
  selectQueryDateLastIndexed,
  selectQueryRoot,
} from '../../reducers/query/selectors';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';
import { isTrue } from '../../utils';
import { useAppSelector } from '../../app/hooks';

export const useGetList = () => {
  const filters = useAppSelector(selectFiltersRoot);
  const query = useAppSelector(selectQueryRoot);
  const qs = useAppSelector(selectRoutesQueryString);
  const queryParams = extractBasicParams(filters, query);
  const dateLastIndexed = useAppSelector(selectQueryDateLastIndexed);
  const shouldSkip = isTrue([qs === '', !dateLastIndexed]);
  return useGetListQuery(queryParams, {
    skip: shouldSkip,
  });
};
