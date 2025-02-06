/* eslint complexity: ["error", 6] */
import PropTypes from 'prop-types';
import { createElement, useState } from 'react';

//TODO: will make much less complex in implementation
// eslint-disable-next-line complexity
export const MoreOrLess = ({
  listComponent,
  listComponentProps = {},
  options,
  perBucketProps = (bucket, props) => props,
  hasMore = false,
}) => {
  const [currentlyHasMore, setCurrentlyHasMore] = useState(hasMore);

  const all = options;
  const some = all.length > 5 ? all.slice(0, 5) : all;
  const remain = all.length - 5;

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
    setCurrentlyHasMore(!currentlyHasMore);
  };

  return (
    <>
      <ul>
        {currentlyHasMore
          ? all.map((bucket) => buildListComponent(bucket))
          : some.map((bucket) => buildListComponent(bucket))}
      </ul>
      {remain > 0 ? (
        <div>
          <button className="a-btn a-btn--link more" onClick={toggleShowMore}>
            {currentlyHasMore
              ? `- Show ${remain} less`
              : `+ Show ${remain} more`}
          </button>
        </div>
      ) : null}
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
  hasMore: PropTypes.bool,
};
