import PropTypes from 'prop-types';
import { createElement, useState } from 'react';
import getIcon from '../../Common/Icon/iconMap';

export const MoreOrLess = ({
  listComponent,
  listComponentProps = {},
  options,
  perBucketProps = (bucket, props) => props,
}) => {
  const [limit, setLimit] = useState(5);
  const step = 50;
  const some = options.slice(0, limit);
  // either 50, or remaining count
  const nextStep = step < options.length ? step : options.length - limit;
  const buildListComponent = (bucket) => {
    const itemProps = perBucketProps(bucket, {
      ...listComponentProps,
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
  listComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  listComponentProps: PropTypes.object,
  options: PropTypes.array.isRequired,
  perBucketProps: PropTypes.func,
};
