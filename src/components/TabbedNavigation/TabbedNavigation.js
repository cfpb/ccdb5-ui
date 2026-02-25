import './TabbedNavigation.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
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
        <Button
          label="Trends"
          iconLeft="chart"
          className={getTabClass('Trends')}
          onClick={() => dispatch(tabChanged('Trends'))}
        />

        <Button
          label="List"
          iconLeft="list"
          className={getTabClass('List')}
          onClick={() => dispatch(tabChanged('List'))}
        />

        <Button
          label="Map"
          iconLeft="map"
          className={getTabClass('Map')}
          onClick={() => dispatch(tabChanged('Map'))}
        />
      </section>
    </div>
  );
};
