import { useSelector } from 'react-redux';
import Hero from './Hero';
import { IntlProvider } from 'react-intl';
import React from 'react';
import RefinePanel from '../RefinePanel';
import ResultsPanel from '../ResultsPanel';
import RootModal from '../Dialogs/RootModal';
import SearchPanel from './SearchPanel';
import { selectViewIsPrintMode } from '../../reducers/view/selectors';
import { Tour } from '../Tour/Tour';
import WindowSize from '../WindowSize';
import { useUpdateLocation } from '../../hooks/useUpdateLocation';

export const SearchComponents = () => {
  useUpdateLocation();
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const printClass = isPrintMode ? 'print' : '';

  return (
    <IntlProvider locale="en">
      <main className={'content content__1-3 ' + printClass} role="main">
        <WindowSize />
        <Hero />
        <div className="content_wrapper">
          <SearchPanel />
          <RefinePanel />
          <ResultsPanel />
        </div>
        <Tour />
        <RootModal />
      </main>
    </IntlProvider>
  );
};
