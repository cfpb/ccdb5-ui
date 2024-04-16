import './FilterPanel.less';
import { Company } from './Company';
import { CompanyReceivedFilter } from './CompanyReceivedFilter';
import { connect } from 'react-redux';
import { DateFilter } from './DateFilter';
import { FederalState } from './FederalState';
import { filterVisibilityToggled } from '../../actions/view';
import { HasNarrative } from './HasNarrative';
import getIcon from '../iconMap';
import { Issue } from './Issue';
import { Product } from './Product';
import PropTypes from 'prop-types';
import React from 'react';
import SimpleFilter from './SimpleFilter';
import { ZipCode } from './ZipCode';

export class FilterPanel extends React.Component {
  render() {
    const descPublicResponse =
      "The company's optional public-facing " +
      "response to a consumer's complaint. Companies can choose to " +
      'select a response from a pre-set list of options that will be ' +
      'posted on the public database.';
    const descConsumerConsent =
      'Whether a consumer opted in to publish their complaint narrative';
    const descTags =
      'Data that supports easier searching and sorting of ' +
      'complaints submitted by or on behalf of consumers';

    return (
      <div>
        {!!this.props.hasFilters && (
          <section className="filter-panel">
            {!!this.props.hasButton && (
              <div className="filter-button">
                <button
                  className="a-btn"
                  title="Close filters"
                  onClick={this.props.onFilterToggle}
                >
                  Close filters {getIcon('delete')}
                </button>
              </div>
            )}
            <h3>Filter results by...</h3>
            <DateFilter />
            <hr />
            <Product />
            <hr />
            <Issue />
            <hr />
            <FederalState />
            <hr />
            <ZipCode />
            <hr />
            <Company />
            <hr />
            <SimpleFilter
              title="Did company provide a timely response?"
              desc="Whether the company gave a timely response"
              fieldName="timely"
            />
            <hr />
            <SimpleFilter
              title="Company response to consumer"
              desc="This is how the company responded. For
                         example, 'Closed with explanation'."
              fieldName="company_response"
            />
            <hr />
            <SimpleFilter
              title="Company public response"
              desc={descPublicResponse}
              fieldName="company_public_response"
            />
            <hr />
            <CompanyReceivedFilter />
            <hr />
            <SimpleFilter
              title="Consumer consent provided?"
              desc={descConsumerConsent}
              fieldName="consumer_consent_provided"
            />
            <hr />
            <HasNarrative />
            <hr />
            <SimpleFilter
              title="How did the consumer submit the
             complaint to the CFPB?"
              fieldName="submitted_via"
            />
            <hr />
            <SimpleFilter title="Tags" desc={descTags} fieldName="tags" />
          </section>
        )}
      </div>
    );
  }
}

export const mapStateToProps = (state) => ({
  hasButton: state.view.width < 750,
  hasFilters: state.view.hasFilters,
});

export const mapDispatchToProps = (dispatch) => ({
  onFilterToggle: () => {
    dispatch(filterVisibilityToggled());
  },
});

// eslint-disable-next-line react-redux/prefer-separate-component-file
export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);

FilterPanel.defaultProps = {
  hasFilters: true,
};

FilterPanel.propTypes = {
  onFilterToggle: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool,
  hasButton: PropTypes.bool.isRequired,
};
