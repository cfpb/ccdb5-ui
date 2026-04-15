import './SearchPanel.scss';
import { PillPanel } from './PillPanel';
import { SearchBar } from './SearchBar';
import { formatDisplayDate } from '../../utils/formatDate';
import { useGetMetaQuery } from '../../api/complaints';
import { Loading } from '../Loading/Loading';
import { Heading, WellContainer } from '@cfpb/design-system-react';

export const SearchPanel = () => {
  const { data, isLoading, isFetching } = useGetMetaQuery('meta');
  const lastIndexed = data?._meta?.last_indexed;
  const lastIndexedMessage = lastIndexed ? (
    <span className="date-subscript">
      (last updated: {formatDisplayDate(lastIndexed)})
    </span>
  ) : null;

  return isLoading || isFetching ? (
    <Loading isLoading={true} />
  ) : (
    <WellContainer className="search-panel">
      <Heading type="2">Search complaint data {lastIndexedMessage}</Heading>
      <SearchBar />
      <PillPanel />
    </WellContainer>
  );
};
