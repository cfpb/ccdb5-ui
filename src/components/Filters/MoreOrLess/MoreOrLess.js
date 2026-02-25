import PropTypes from 'prop-types';
import { createElement, useState } from 'react';
import { Button } from '@cfpb/design-system-react';
import { coalesce, sortOptions } from '../../../utils';
import { useSelector } from 'react-redux';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';

export const MoreOrLess = ({
  fieldName,
  listComponent,
  options,
  perBucketProps = (bucket, props) => props,
  hasMore = false,
}) => {
  const [currentlyHasMore, setCurrentlyHasMore] = useState(hasMore);
  const filters = useSelector(selectFiltersRoot);
  const selectedFilters = coalesce(filters, fieldName, []);
  const all = sortOptions(options, selectedFilters, fieldName);
  const some = all.length > 5 ? all.slice(0, 5) : all;
  const remain = all.length - 5;

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
          <Button
            label={
              currentlyHasMore
                ? `- Show ${remain} less`
                : `+ Show ${remain} more`
            }
            asLink
            className="more"
            onClick={toggleShowMore}
          />
        </div>
      ) : null}
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
  hasMore: PropTypes.bool,
};
