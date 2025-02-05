import { useSelector } from 'react-redux';
import { FilterPanel } from '../Filters/FilterPanel/FilterPanel';
import { selectViewTab, selectViewWidth } from '../../reducers/view/selectors';

export const RefinePanel = () => {
  const tab = useSelector(selectViewTab);
  const width = useSelector(selectViewWidth);
  const hasDesktopFilters = width > 749;

  return hasDesktopFilters ? (
    <aside className={`content__sidebar ${tab.toLowerCase()}`}>
      <FilterPanel />
    </aside>
  ) : null;
};
