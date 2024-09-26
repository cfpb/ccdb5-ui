import { useDispatch, useSelector } from 'react-redux';
import { Hero } from './Hero/Hero';
import { useEffect } from 'react';
import { RefinePanel } from './RefinePanel';
import { ResultsPanel } from '../ResultsPanel';
import { RootModal } from '../Dialogs/RootModal';
import { SearchPanel } from './SearchPanel';
import { selectViewIsPrintMode } from '../../reducers/view/selectors';
import { Tour } from '../Tour/Tour';
import { useUpdateLocation } from '../../hooks/useUpdateLocation';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useEvent } from '../../hooks/useEvent';
import { printModeOff, printModeOn } from '../../actions/view';

export const SearchComponents = () => {
  useUpdateLocation();
  useWindowSize();

  const isPrintMode = useSelector(selectViewIsPrintMode);
  const dispatch = useDispatch();

  useEvent('afterprint', () => {
    if (isPrintMode) {
      dispatch(printModeOff());
    }
  });
  useEvent('beforeprint', () => {
    if (!isPrintMode) {
      dispatch(printModeOn());
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
      className={`content content--1-3 ${isPrintMode ? 'print' : ''}`}
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
