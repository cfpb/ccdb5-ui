import './LensTabs.less';
import { changeDataSubLens } from '../../actions/trends';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { sendAnalyticsEvent } from '../../utils';

const lensMaps = {
  Company: {
    tab1: { displayName: 'Products', filterName: 'product' },
  },
  Product: {
    tab1: { displayName: 'Sub-products', filterName: 'sub_product' },
    tab2: { displayName: 'Issues', filterName: 'issue' },
  },
};

export class LensTabs extends React.Component {
  _getTabClass(tab) {
    tab = tab.toLowerCase();
    const classes = ['tab', tab];
    const regex = new RegExp(this.props.subLens.toLowerCase(), 'g');
    if (tab.replace('-', '_').match(regex)) {
      classes.push('active');
    }
    return classes.join(' ');
  }

  render() {
    const { lens, hasProductTab } = this.props;
    if (lens === 'Overview') {
      return null;
    }

    const currentLens = lensMaps[lens];
    return (
      <div className="tabbed-navigation lens">
        <section>
          {hasProductTab && (
            <button
              className={this._getTabClass(currentLens.tab1.filterName)}
              onClick={() => {
                this.props.onTab(lens, currentLens.tab1.filterName);
              }}
            >
              {currentLens.tab1.displayName}
            </button>
          )}
          {lensMaps[lens].tab2 && (
            <button
              className={this._getTabClass(currentLens.tab2.filterName)}
              onClick={() => {
                this.props.onTab(lens, currentLens.tab2.filterName);
              }}
            >
              {currentLens.tab2.displayName}
            </button>
          )}
        </section>
      </div>
    );
  }
}

const displayProductTab = (lens, focus, results) => {
  if (!focus) {
    return true;
  } else if (results['sub-product'] && results['sub-product'].length) {
    return true;
  }
  return false;
};

export const mapStateToProps = (state) => {
  const { focus, lens, subLens } = state.query;
  const { results } = state.trends;
  return {
    focus,
    lens,
    hasProductTab: displayProductTab(lens, focus, results),
    subLens,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  onTab: (lens, tab) => {
    const labelMap = {
      // eslint-disable-next-line camelcase
      sub_product: 'Sub-products',
      issue: 'Issues',
      product: 'Products',
    };

    sendAnalyticsEvent('Button', lens + ':' + labelMap[tab]);
    dispatch(changeDataSubLens(tab.toLowerCase()));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LensTabs);

LensTabs.propTypes = {
  subLens: PropTypes.string.isRequired,
  lens: PropTypes.string.isRequired,
  hasProductTab: PropTypes.bool,
  onTab: PropTypes.func.isRequired,
};
