import { connect } from 'react-redux';
import Hero from './Hero';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import RefinePanel from '../RefinePanel';
import ResultsPanel from '../ResultsPanel';
import RootModal from '../Dialogs/RootModal';
import SearchPanel from './SearchPanel';
import { Tour } from '../Tour/Tour';
import UrlBarSynch from '../UrlBarSynch';
import WindowSize from '../WindowSize';

export class SearchComponents extends React.Component {
  render() {
    return (
      <IntlProvider locale="en">
        <main
          className={'content content__1-3 ' + this.props.printClass}
          role="main"
        >
          <WindowSize />
          <UrlBarSynch />
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
  }
}

export const mapStateToProps = (state) => ({
  printClass: state.view.isPrintMode ? 'print' : '',
});

export default connect(mapStateToProps)(SearchComponents);

SearchComponents.propTypes = {
  printClass: PropTypes.string.isRequired,
};