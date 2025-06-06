import './SearchPanel.scss';
import { PillPanel } from './PillPanel';
import { SearchBar } from './SearchBar';
import { formatDisplayDate } from '../../utils/formatDate';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';

export const SearchPanel = () => {
  const { data } = useGetAggregations();
  const lastIndexed = data?.lastIndexed;
  const lastIndexedMessage = lastIndexed ? (
    <span className="date-subscript">
      (last updated: {formatDisplayDate(lastIndexed)})
    </span>
  ) : null;

  return (
    <div className="search-panel">
      <h2>Search complaint data {lastIndexedMessage}</h2>
      <SearchBar />
      <PillPanel />
    </div>
  );
};
