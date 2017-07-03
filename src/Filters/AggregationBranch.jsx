import React from 'react'
import { FormattedNumber } from 'react-intl'
import { SLUG_SEPARATOR } from '../constants'
import AggregationItem from './AggregationItem';
import './AggregationBranch.less'

export const AggregationBranch = ({item, subitems, fieldName, active, onClick}) => {
  // Fix up the subitems to prepend the current item key
  const buckets = subitems.map(sub => {
    return {
      key: item.key + SLUG_SEPARATOR + sub.key,
      value: sub.key,
      doc_count: sub.doc_count
    }
  })

  return (
    <div className="aggregation-branch">
      <li className="flex-fixed layout-row parent" key={item.key}>
        <input type="checkbox" className="flex-fixed"
               aria-label={item.key}
               checked={active}
               onClick={onClick}
        />
        <div className="flex-all toggle">
          <button className="a-btn a-btn__link hover">
            <span className="parent-key">{item.key}</span>
            <span className="cf-icon cf-icon-up"></span>
          </button>
        </div>
        <span className="flex-fixed parent-count">
          <FormattedNumber value={item.doc_count} />
        </span>
      </li>
      <ul className="children">
      {buckets.map(bucket =>
          <AggregationItem item={bucket} key={bucket.key} fieldName={fieldName} />
      )}
      </ul>
    </div>
  )
}

export default AggregationBranch
