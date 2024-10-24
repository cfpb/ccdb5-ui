import './SearchPanel.scss';
import { PillPanel } from './PillPanel';
import { SearchBar } from './SearchBar';
import { formatDisplayDate } from '../../utils/formatDate';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';

export const SearchPanel = () => {
  const { data, isLoading, isFetching } = useGetAggregations();

  if (isLoading || isFetching) {
    return null;
  }

  const lastIndexed = data?.lastIndexed;
  let lastIndexedMessage = null;

  if (lastIndexed) {
    lastIndexedMessage = (
      <span className="date-subscript">
        (last updated: {formatDisplayDate(lastIndexed)})
      </span>
    );
  }

  return (
    <div className="search-panel">
      <h2>Search complaint data {lastIndexedMessage}</h2>
      <SearchBar />
      <PillPanel />
    </div>
  );
};
