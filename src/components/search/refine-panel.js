import { useSelector } from 'react-redux';
import { FilterPanel } from '../filters/filter-panel/filter-panel';
import { selectViewWidth } from '../../reducers/view/selectors';
import { BP_MED_MIN } from '../../constants/breakpoints';

export const RefinePanel = () => {
  const width = useSelector(selectViewWidth);
  const hasDesktopFilters = width >= BP_MED_MIN;

  return hasDesktopFilters ? (
    <aside className="content__sidebar">
      <FilterPanel />
    </aside>
  ) : null;
};
