import './SearchPanel.scss';
import { useSelector } from 'react-redux';
import { PillPanel } from './PillPanel';
import { SearchBar } from './SearchBar';
import { selectAggsLastIndexed } from '../../reducers/aggs/selectors';
import { formatDisplayDate } from '../../utils/formatDate';

export const SearchPanel = () => {
  const lastIndexed = useSelector(selectAggsLastIndexed);
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
