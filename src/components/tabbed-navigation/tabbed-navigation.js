import { Tab, TabList } from '@cfpb/design-system-react';
import { useDispatch, useSelector } from 'react-redux';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';
import { selectViewTab } from '../../reducers/view/selectors';
import { tabChanged } from '../../reducers/view/view-slice';

export const VIEW_TABS = [
  { id: 'trends', mode: MODE_TRENDS, label: 'Trends', iconLeft: 'chart' },
  { id: 'list', mode: MODE_LIST, label: 'List', iconLeft: 'list' },
  { id: 'map', mode: MODE_MAP, label: 'Map', iconLeft: 'map' },
];

/**
 * @param {string} mode - View mode constant (Trends / List / Map)
 * @returns {string} Tab id used by DSR Tab / TabPanel
 */
export const getViewTabId = (mode) =>
  VIEW_TABS.find((item) => item.mode === mode)?.id ?? 'trends';

export const TabbedNavigation = () => {
  const dispatch = useDispatch();
  const tab = useSelector(selectViewTab);

  return (
    // Wrapper keeps print/tour hooks; tab chrome comes from DSR only.
    <div className="tabbed-navigation" data-tour="tabbed-navigation">
      <TabList isInverted>
        {VIEW_TABS.map(({ id, mode, label, iconLeft }) => (
          <Tab
            key={id}
            id={id}
            value={mode}
            label={label}
            iconLeft={iconLeft}
            isActive={tab === mode}
            onClick={() => dispatch(tabChanged(mode))}
          />
        ))}
      </TabList>
    </div>
  );
};
