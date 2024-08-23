import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectAggsState } from '../../../reducers/aggs/selectors';
import { coalesce } from '../../../utils';
import CollapsibleFilter from '../CollapsibleFilter/CollapsibleFilter';
import MoreOrLess from '../MoreOrLess/MoreOrLess';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';

import '../Aggregation/Aggregation.less';

const SimpleFilter = ({ fieldName, title, desc }) => {
  const aggs = useSelector(selectAggsState);

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

export default SimpleFilter;
