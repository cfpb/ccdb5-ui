import './TabbedNavigation.less';
import { useDispatch, useSelector } from 'react-redux';
import iconMap from './iconMap';
import React from 'react';
import { selectQueryTab } from '../reducers/query/selectors';
import { changeTab } from '../reducers/query/query';

export const TabbedNavigation = () => {
  const dispatch = useDispatch();
  const tab = useSelector(selectQueryTab);

  const getTabClass = (selectedTab) => {
    const tabName = selectedTab.toLowerCase() + ' tab';
    return tab === selectedTab ? tabName + ' active' : tabName;
  };

  return (
    <div className="tabbed-navigation" data-tour="tabbed-navigation">
      <section>
        <button
          className={getTabClass('Trends')}
          onClick={() => dispatch(changeTab('Trends'))}
        >
          {iconMap.getIcon('chart')}
          Trends
        </button>

        <button
          className={getTabClass('List')}
          onClick={() => dispatch(changeTab('List'))}
        >
          {iconMap.getIcon('list')}
          List
        </button>

        <button
          className={getTabClass('Map')}
          onClick={() => dispatch(changeTab('Map'))}
        >
          {iconMap.getIcon('map')}
          Map
        </button>
      </section>
    </div>
  );
};
