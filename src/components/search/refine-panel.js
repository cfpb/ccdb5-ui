import { useSelector } from 'react-redux';
import { FilterPanel } from '../filters/filter-panel/filter-panel';
import { selectViewWidth } from '../../reducers/view/selectors';

export const RefinePanel = () => {
  const width = useSelector(selectViewWidth);
  const hasDesktopFilters = width > 749;

  return hasDesktopFilters ? (
    <aside className="content__sidebar">
      <FilterPanel />
    </aside>
  ) : null;
};
