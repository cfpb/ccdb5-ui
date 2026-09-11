import './search-panel.scss';
import { SearchBar } from './search-bar';
import { formatNaturalDate } from '../../utils/format-date';
import { useGetMetaQuery } from '../../api/complaints';
import { Loading } from '../loading/loading';
import { Heading, WellContainer } from '@cfpb/design-system-react';

export const SearchPanel = () => {
  const { data, isLoading, isFetching } = useGetMetaQuery('meta');
  const lastIndexed = data?._meta?.last_indexed;
  const lastIndexedMessage = lastIndexed ? (
    <span className="search-panel__last-updated">
      (Last updated {formatNaturalDate(lastIndexed)})
    </span>
  ) : null;

  return isLoading || isFetching ? (
    <Loading isLoading={true} />
  ) : (
    <WellContainer className="search-panel">
      <Heading type="3">Search complaint data {lastIndexedMessage}</Heading>
      <SearchBar />
    </WellContainer>
  );
};
