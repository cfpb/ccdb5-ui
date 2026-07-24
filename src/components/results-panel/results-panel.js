import { MODE_LIST, MODE_MAP } from '../../constants';
import { useSelector } from 'react-redux';
import { ListPanel } from '../list/list-panel/list-panel';
import { MapPanel } from '../map/map-panel';
import { PrintInfo } from '../print/print-info';
import { PrintInfoFooter } from '../print/print-info-footer';
import { selectViewTab } from '../../reducers/view/selectors';
import { TrendsPanel } from '../trends/trends-panel/trends-panel';

export const ResultsPanel = () => {
  const tab = useSelector(selectViewTab);
  let currentPanel;

  switch (tab) {
    case MODE_MAP: {
      currentPanel = <MapPanel />;
      break;
    }
    case MODE_LIST: {
      currentPanel = <ListPanel />;
      break;
    }
    default: {
      currentPanel = <TrendsPanel />;
      break;
    }
  }

  return (
    <div className={'content__main ' + tab.toLowerCase()}>
      <PrintInfo />
      {currentPanel}
      <PrintInfoFooter />
    </div>
  );
};
