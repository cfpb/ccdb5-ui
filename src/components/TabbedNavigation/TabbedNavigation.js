import './TabbedNavigation.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@cfpb/design-system-react';
import { selectViewTab } from '../../reducers/view/selectors';
import { tabChanged } from '../../reducers/view/viewSlice';

export const TabbedNavigation = () => {
  const dispatch = useDispatch();
  const tab = useSelector(selectViewTab);

  const getTabClass = (selectedTab) => {
    const tabName = selectedTab.toLowerCase() + ' tab';
    return tab === selectedTab ? tabName + ' active' : tabName;
  };

  return (
    <div className="tabbed-navigation" data-tour="tabbed-navigation">
      <section>
        <button
          className={getTabClass('Trends')}
          onClick={() => dispatch(tabChanged('Trends'))}
        >
          <Icon name="chart" isPresentational />
          Trends
        </button>

        <button
          className={getTabClass('List')}
          onClick={() => dispatch(tabChanged('List'))}
        >
          <Icon name="list" isPresentational />
          List
        </button>

        <button
          className={getTabClass('Map')}
          onClick={() => dispatch(tabChanged('Map'))}
        >
          <Icon name="map" isPresentational />
          Map
        </button>
      </section>
    </div>
  );
};
