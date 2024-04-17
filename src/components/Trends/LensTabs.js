import './LensTabs.less';
import { changeDataSubLens } from '../../actions/trends';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { sendAnalyticsEvent } from '../../utils';
import {
  selectQueryFocus,
  selectQueryLens,
  selectQuerySubLens,
} from '../../reducers/query/selectors';
import { selectTrendsResultsSubProduct } from '../../reducers/trends/selectors';

const lensMaps = {
  Company: {
    tab1: { displayName: 'Products', filterName: 'product' },
  },
  Product: {
    tab1: { displayName: 'Sub-products', filterName: 'sub_product' },
    tab2: { displayName: 'Issues', filterName: 'issue' },
  },
};

const displayProductTab = (lens, focus, subProducts) => {
  if (!focus) {
    return true;
  } else if (subProducts && subProducts.length) {
    return true;
  }
  return false;
};

export const LensTabs = () => {
  const dispatch = useDispatch();
  const focus = useSelector(selectQueryFocus);
  const lens = useSelector(selectQueryLens);
  const subLens = useSelector(selectQuerySubLens);
  const subProducts = useSelector(selectTrendsResultsSubProduct);

  if (lens === 'Overview') {
    return null;
  }
  const hasProductTab = displayProductTab(lens, focus, subProducts);
  const onTab = (lens, tab) => {
    const labelMap = {
      // eslint-disable-next-line camelcase
      sub_product: 'Sub-products',
      issue: 'Issues',
      product: 'Products',
    };
    sendAnalyticsEvent('Button', lens + ':' + labelMap[tab]);
    dispatch(changeDataSubLens(tab.toLowerCase()));
  };
  const _getTabClass = (tab) => {
    tab = tab.toLowerCase();
    const classes = ['tab', tab];
    const regex = new RegExp(subLens.toLowerCase(), 'g');
    if (tab.replace('-', '_').match(regex)) {
      classes.push('active');
    }
    return classes.join(' ');
  };

  const currentLens = lensMaps[lens];
  return (
    <div className="tabbed-navigation lens">
      <section>
        {!!hasProductTab && (
          <button
            className={_getTabClass(currentLens.tab1.filterName)}
            onClick={() => {
              onTab(lens, currentLens.tab1.filterName);
            }}
          >
            {currentLens.tab1.displayName}
          </button>
        )}
        {!!lensMaps[lens].tab2 && (
          <button
            className={_getTabClass(currentLens.tab2.filterName)}
            onClick={() => {
              onTab(lens, currentLens.tab2.filterName);
            }}
          >
            {currentLens.tab2.displayName}
          </button>
        )}
      </section>
    </div>
  );
};
