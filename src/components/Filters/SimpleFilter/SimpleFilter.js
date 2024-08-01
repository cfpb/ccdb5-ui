import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectAggsState } from '../../../reducers/aggs/selectors';
import { selectQueryState } from '../../../reducers/query/selectors';
import { coalesce } from '../../../utils';
import CollapsibleFilter from '../CollapsibleFilter';
import MoreOrLess from '../MoreOrLess';
import AggregationItem from '../AggregationItem/AggregationItem';

//TODO: when upgraded to redux toolkit, use createSelector
//to derive this data directly from aggs and query state
export const extraData = (fieldName, aggs, query) => {
  const activeChildren = coalesce(query, fieldName, []);
  const options = coalesce(aggs, fieldName, []);
  const hasChildren = activeChildren.length > 0;

  return { options, hasChildren };
};

const SimpleFilter = ({ fieldName, title, desc }) => {
  const aggs = useSelector(selectAggsState);
  const query = useSelector(selectQueryState);

  const { options, hasChildren } = extraData(fieldName, aggs, query);

  const listComponentProps = { fieldName };

  return (
    <CollapsibleFilter
      title={title}
      desc={desc}
      hasChildren={hasChildren}
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
