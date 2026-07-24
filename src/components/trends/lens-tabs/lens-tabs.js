import './lens-tabs.scss';
import { Tab, TabList } from '@cfpb/design-system-react';
import { dataSubLensChanged } from '../../../reducers/trends/trends-slice';
import { useDispatch, useSelector } from 'react-redux';
import { sendAnalyticsEvent } from '../../../utils';
import {
  selectTrendsFocus,
  selectTrendsLens,
  selectTrendsSubLens,
} from '../../../reducers/trends/selectors';
import { useGetTrends } from '../../../api/hooks/use-get-trends';

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
  }
  if (subProducts && subProducts.length > 0) {
    return true;
  }
  return false;
};

const isTabActive = (filterName, subLens) => {
  const tab = filterName.toLowerCase();
  const regex = new RegExp(subLens.toLowerCase(), 'g');
  return regex.test(tab.replace('-', '_'));
};

export const LensTabs = () => {
  const dispatch = useDispatch();
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const subLens = useSelector(selectTrendsSubLens);
  const { data } = useGetTrends();

  if (lens === 'Overview') {
    return null;
  }

  const subProducts = data?.results['sub-product'];
  const hasProductTab = displayProductTab(lens, focus, subProducts);
  const onTab = (lensName, tab) => {
    const labelMap = {
      sub_product: 'Sub-products',
      issue: 'Issues',
      product: 'Products',
    };
    sendAnalyticsEvent('Button', lensName + ':' + labelMap[tab]);

    dispatch(dataSubLensChanged(tab.toLowerCase()));
  };
  const currentLens = lensMaps[lens];
  const tabs = [
    hasProductTab && {
      id: currentLens.tab1.filterName,
      label: currentLens.tab1.displayName,
      filterName: currentLens.tab1.filterName,
    },
    currentLens.tab2 && {
      id: currentLens.tab2.filterName,
      label: currentLens.tab2.displayName,
      filterName: currentLens.tab2.filterName,
    },
  ].filter(Boolean);

  return (
    <div className="tabbed-navigation lens">
      <TabList>
        {tabs.map(({ id, label, filterName }) => (
          <Tab
            key={id}
            id={id}
            value={filterName}
            label={label}
            isActive={isTabActive(filterName, subLens)}
            onClick={() => {
              onTab(lens, filterName);
            }}
          />
        ))}
      </TabList>
    </div>
  );
};
