import { useDispatch, useSelector } from 'react-redux';
import { filterRemoved } from '../../../reducers/filters/filtersSlice';
import {
  selectTrendsSubLens,
  selectTrendsFocus,
  selectTrendsLens,
} from '../../../reducers/trends/selectors';
import { sanitizeHtmlId } from '../../../utils';
import getIcon from '../../Common/Icon/iconMap';

export const TooltipRow = ({ value }) => {
  const dispatch = useDispatch();
  const trendsFocus = useSelector(selectTrendsFocus);
  const focus = trendsFocus ? 'focus' : '';
  const lens = useSelector(selectTrendsLens);
  const subLens = useSelector(selectTrendsSubLens);
  const hasCompanyTypeahead = lens === 'Company' && !focus;
  const elements = [];
  const lensToUse = focus ? subLens : lens;
  const plurals = {
    Product: 'products',
    product: 'products',
    issue: 'issues',
    'Sub-Issue': 'sub-issues',
    sub_product: 'sub-products',
    Company: 'companies',
  };

  // Other should never be a selectable focus item
  if (value.name === 'Other') {
    elements.push(
      <span className="u-left" key={value.name}>
        All other {plurals[lensToUse]}
      </span>,
    );
    return elements;
  }

  if (focus) {
    elements.push(
      <span className="u-left" key={value.name}>
        {value.name}
      </span>,
    );
    return elements;
  }

  elements.push(
    <span
      className="u-left"
      id={sanitizeHtmlId('focus-' + value.name)}
      key={value.name}
    >
      {value.name}
    </span>,
  );

  // add in the close button for Company and there's no focus yet
  if (hasCompanyTypeahead) {
    elements.push(
      <button
        aria-label={'Remove ' + value.name + ' from comparison set'}
        className="u-right a-btn a-btn--link close"
        key={'close_' + value.name}
        onClick={() => {
          dispatch(filterRemoved('company', value.name));
        }}
      >
        {getIcon('delete')}
      </button>,
    );
  }

  return elements;
};
