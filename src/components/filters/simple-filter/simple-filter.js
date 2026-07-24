import PropTypes from 'prop-types';
import { coalesce } from '../../../utils';
import { CollapsibleFilter } from '../collapsible-filter/collapsible-filter';
import { MoreOrLess } from '../more-or-less/more-or-less';
import { AggregationItem } from '../aggregation/aggregation-item/aggregation-item';

import '../aggregation/aggregation.scss';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';

export const SimpleFilter = ({ fieldName, title, desc }) => {
  const { data: aggData, error } = useGetAggregations();
  const aggs = error ? {} : aggData;
  const options = coalesce(aggs, fieldName, []);

  return (
    <CollapsibleFilter
      title={title}
      desc={desc}
      className={'aggregation simple ' + fieldName}
    >
      <MoreOrLess
        fieldName={fieldName}
        listComponent={AggregationItem}
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
