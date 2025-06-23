import PropTypes from 'prop-types';
import { createElement, useState } from 'react';
import { coalesce, sortOptions } from '../../../utils';
import { useSelector } from 'react-redux';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import getIcon from '../../Common/Icon/iconMap';

export const MoreOrLess = ({
  fieldName,
  listComponent,
  options,
  perBucketProps = (bucket, props) => props,
}) => {
  const filters = useSelector(selectFiltersRoot);
  const selectedFilters = coalesce(filters, fieldName, []);
  const [limit, setLimit] = useState(5);
  const all = sortOptions(options, selectedFilters, fieldName);
  const step = 50;
  const some = options.slice(0, limit);
  // either 50, or remaining count
  const nextStep = step < all.length ? step : all.length - limit;
  const buildListComponent = (bucket) => {
    const itemProps = perBucketProps(bucket, {
      fieldName,
      item: bucket,
      key: bucket.key,
    });

    //using createElement because listComponent variable
    //cannot be read properly via JSX
    return createElement(listComponent, itemProps);
  };

  const toggleShowMore = () => {
    setLimit(limit + nextStep);
  };

  return (
    <>
      <ul>{some.map((bucket) => buildListComponent(bucket))}</ul>
      {some.length < options.length && (
        <div>
          <button className="a-btn a-btn--link more" onClick={toggleShowMore}>
            {getIcon('plus')}
            <span>{`Show ${nextStep} more`}</span>
          </button>
        </div>
      )}
    </>
  );
};

MoreOrLess.propTypes = {
  fieldName: PropTypes.string.isRequired,
  listComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  options: PropTypes.array.isRequired,
  perBucketProps: PropTypes.func,
};
