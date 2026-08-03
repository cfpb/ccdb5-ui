import { useDispatch, useSelector } from 'react-redux';
import { Hero } from './hero/hero';
import { useEffect } from 'react';
import { RefinePanel } from './refine-panel';
import { ResultsPanel } from '../results-panel/results-panel';
import { RootModal } from '../dialogs/root-modal';
import { selectViewIsPrintMode } from '../../reducers/view/selectors';
import { Tour } from '../tour/tour';
import { useUpdateLocation } from '../../hooks/use-update-location';
import { useWindowSize } from '../../hooks/use-window-size';
import { useEvent } from '../../hooks/use-event';
import {
  updatePrintModeOff,
  updatePrintModeOn,
} from '../../reducers/view/view-slice';
import { SearchPanel } from './search-panel';
import { ActionBar } from '../action-bar/action-bar';
import { PillPanel } from './pill-panel';

export const SearchComponents = () => {
  useUpdateLocation();
  useWindowSize();

  const isPrintMode = useSelector(selectViewIsPrintMode);
  const dispatch = useDispatch();

  useEvent('afterprint', () => {
    if (isPrintMode) {
      dispatch(updatePrintModeOff());
    }
  });
  useEvent('beforeprint', () => {
    if (!isPrintMode) {
      dispatch(updatePrintModeOn());
    }
  });

  useEffect(() => {
    if (isPrintMode) {
      setTimeout(() => {
        print();
      }, 2000);
    }
  }, [isPrintMode]);

  return (
    <main
      className={`content content--1-3 ccdb-content ${isPrintMode ? 'print' : ''}`}
      role="main"
    >
      <Hero />
      <div className="content__wrapper">
        <SearchPanel />
        <ActionBar />
        <PillPanel />
        <RefinePanel />
        <ResultsPanel />
      </div>
      <Tour />
      <RootModal />
    </main>
  );
};
