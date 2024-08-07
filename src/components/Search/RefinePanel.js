import { useSelector } from 'react-redux';
import { FilterPanel } from '../Filters/FilterPanel';
import React from 'react';
import { selectViewTab } from '../../reducers/view/selectors';
import { selectViewWidth } from '../../reducers/view/selectors';

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
