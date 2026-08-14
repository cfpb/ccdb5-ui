import { TabPanel } from '@cfpb/design-system-react';
import { ActionBar } from '../action-bar/action-bar';
import { ListPanel } from '../list/list-panel/list-panel';
import { PrintInfo } from '../print/print-info';
import { PrintInfoFooter } from '../print/print-info-footer';

export const ResultsPanel = () => {
  return (
    <div className="content__main list">
      <PrintInfo />
      <ActionBar />
      <TabPanel id="list">
        <ListPanel />
      </TabPanel>
      <PrintInfoFooter />
    </div>
  );
};
