import './TabbedNavigation.less';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from './iconMap';
import { selectQueryTab } from '../reducers/query/selectors';
import { tabChanged } from '../actions/view';

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
          onClick={() => dispatch(tabChanged('Trends'))}
        >
          {getIcon('chart')}
          Trends
        </button>

        <button
          className={getTabClass('List')}
          onClick={() => dispatch(tabChanged('List'))}
        >
          {getIcon('list')}
          List
        </button>

        <button
          className={getTabClass('Map')}
          onClick={() => dispatch(tabChanged('Map'))}
        >
          {getIcon('map')}
          Map
        </button>
      </section>
    </div>
  );
};
