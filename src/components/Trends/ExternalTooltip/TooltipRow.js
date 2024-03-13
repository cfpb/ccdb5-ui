import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectQueryFocus,
  selectQueryLens,
  selectQuerySubLens,
} from '../../../reducers/query/selectors';
import { sanitizeHtmlId } from '../../../utils';
import getIcon from '../../iconMap';
import { removeFilter } from '../../../reducers/query/query';

export const TooltipRow = ({ value }) => {
  const dispatch = useDispatch();
  const queryFocus = useSelector(selectQueryFocus);
  const focus = queryFocus ? 'focus' : '';
  const lens = useSelector(selectQueryLens);
  const subLens = useSelector(selectQuerySubLens);
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
        className="u-right a-btn a-btn__link close"
        key={'close_' + value.name}
        onClick={() => {
          dispatch(removeFilter('company', value.name));
        }}
      >
        {getIcon('delete')}
      </button>,
    );
  }

  return elements;
};
