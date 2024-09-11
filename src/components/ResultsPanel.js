import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../constants';
import { useSelector } from 'react-redux';
import { ListPanel } from './List/ListPanel/ListPanel';
import { MapPanel } from './Map/MapPanel';
import { PrintInfo } from './Print/PrintInfo';
import { PrintInfoFooter } from './Print/PrintInfoFooter';
import TrendsPanel from './Trends/TrendsPanel';
import { selectQueryTab } from '../reducers/query/selectors';

export const ResultsPanel = () => {
  const tab = useSelector(selectQueryTab);
  let currentPanel;

  switch (tab) {
    case MODE_MAP:
      currentPanel = <MapPanel />;
      break;
    case MODE_LIST:
      currentPanel = <ListPanel />;
      break;
    case MODE_TRENDS:
    default:
      currentPanel = <TrendsPanel />;
      break;
  }

  return (
    <div className={'content__main ' + tab.toLowerCase()}>
      <PrintInfo />
      {currentPanel}
      <PrintInfoFooter />
    </div>
  );
};
