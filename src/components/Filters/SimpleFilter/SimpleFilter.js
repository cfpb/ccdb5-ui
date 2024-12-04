import PropTypes from 'prop-types';
import { coalesce } from '../../../utils';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { MoreOrLess } from '../MoreOrLess/MoreOrLess';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';

import '../Aggregation/Aggregation.scss';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';

export const SimpleFilter = ({ fieldName, title, desc }) => {
  const { data: aggs } = useGetAggregations();
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
