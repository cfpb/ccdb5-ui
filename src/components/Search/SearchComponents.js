import { useDispatch, useSelector } from 'react-redux';
import { Hero } from './Hero/Hero';
import { useEffect } from 'react';
import { RefinePanel } from './RefinePanel';
import { ResultsPanel } from '../ResultsPanel/ResultsPanel';
import { RootModal } from '../Dialogs/RootModal';
import { selectViewIsPrintMode } from '../../reducers/view/selectors';
import { Tour } from '../Tour/Tour';
import { useUpdateLocation } from '../../hooks/useUpdateLocation';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useEvent } from '../../hooks/useEvent';
import {
  updatePrintModeOff,
  updatePrintModeOn,
} from '../../reducers/view/viewSlice';
import { SearchPanel } from './SearchPanel';

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
        window.print();
      }, 1000);
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
        <RefinePanel />
        <ResultsPanel />
      </div>
      <Tour />
      <RootModal />
    </main>
  );
};
