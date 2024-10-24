import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';
import { useSelector } from 'react-redux';
import { ListPanel } from '../List/ListPanel/ListPanel';
import { MapPanel } from '../Map/MapPanel';
import { PrintInfo } from '../Print/PrintInfo';
import { PrintInfoFooter } from '../Print/PrintInfoFooter';
import { selectViewTab } from '../../reducers/view/selectors';
import { TrendsPanel } from '../Trends/TrendsPanel/TrendsPanel';

export const ResultsPanel = () => {
  const tab = useSelector(selectViewTab);
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
