import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectAggsRoot } from '../../../reducers/aggs/selectors';
import { coalesce } from '../../../utils';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { MoreOrLess } from '../MoreOrLess/MoreOrLess';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';

import '../Aggregation/Aggregation.scss';

export const SimpleFilter = ({ fieldName, title, desc }) => {
  const aggs = useSelector(selectAggsRoot);
  const options = coalesce(aggs, fieldName, []);
  const listComponentProps = { fieldName };

  return (
    <CollapsibleFilter
      title={title}
      desc={desc}
      className={'aggregation simple ' + fieldName}
    >
      <MoreOrLess
        listComponent={AggregationItem}
        listComponentProps={listComponentProps}
        options={options}
      />
    </CollapsibleFilter>
  );
};

SimpleFilter.propTypes = {
  fieldName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
};
