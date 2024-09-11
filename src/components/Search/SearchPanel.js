import './SearchPanel.less';
import { useSelector } from 'react-redux';
import { FormattedDate } from 'react-intl';
import { PillPanel } from './PillPanel';
import { SearchBar } from './SearchBar';
import { selectAggsLastIndexed } from '../../reducers/aggs/selectors';

export const SearchPanel = () => {
  const lastIndexed = useSelector(selectAggsLastIndexed);
  let lastIndexedMessage = null;

  if (lastIndexed) {
    lastIndexedMessage = (
      <span className="date-subscript">
        (last updated: <FormattedDate value={lastIndexed} />)
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
