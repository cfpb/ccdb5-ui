import { cloneDeep, coalesce } from '../../utils';
import CollapsibleFilter from './CollapsibleFilter';
import { CompanyTypeahead } from './CompanyTypeahead';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import StickyOptions from './StickyOptions';

const FIELD_NAME = 'company';

export class Company extends React.Component {
  render() {
    const desc = 'The complaint is about this company.';

    return (
      <CollapsibleFilter
        title="Company name"
        desc={desc}
        className="aggregation company"
      >
        <CompanyTypeahead id={'filter-' + FIELD_NAME} />
        <StickyOptions
          fieldName={FIELD_NAME}
          options={this.props.options}
          selections={this.props.selections}
        />
      </CollapsibleFilter>
    );
  }
}

export const mapStateToProps = (state) => {
  const options = cloneDeep(coalesce(state.aggs, FIELD_NAME, []));
  const selections = coalesce(state.query, FIELD_NAME, []);
  const { focus } = state.query;
  const isFocusPage = focus && state.query.lens === 'Company';

  options.forEach((opt) => {
    opt.disabled = Boolean(isFocusPage && opt.key !== focus);
  });

  return {
    options,
    queryString: state.query.queryString,
    selections,
  };
};

export default connect(mapStateToProps)(Company);

Company.propTypes = {
  options: PropTypes.array.isRequired,
  selections: PropTypes.array.isRequired,
};
