import './FilterPanel.scss';
import { Company } from '../Company/Company';
import { CompanyReceivedFilter } from '../Date/CompanyReceivedFilter';
import { useDispatch, useSelector } from 'react-redux';
import { DateFilter } from '../Date/DateFilter';
import { FederalState } from '../FederalState/FederalState';
import { HasNarrative } from '../HasNarrative/HasNarrative';
import getIcon from '../../Common/Icon/iconMap';
import { Issue } from '../Issue/Issue';
import { Product } from '../Product/Product';
import { SimpleFilter } from '../SimpleFilter/SimpleFilter';
import { ZipCode } from '../ZipCode/ZipCode';
import { updateFilterVisibility } from '../../../reducers/view/viewSlice';
import {
  selectViewHasFilters,
  selectViewWidth,
} from '../../../reducers/view/selectors';

export const FilterPanel = () => {
  const dispatch = useDispatch();
  const width = useSelector(selectViewWidth);
  const hasFilters = useSelector(selectViewHasFilters);
  const hasButton = width < 750;
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
      {!!hasFilters && (
        <section className="filter-panel">
          {!!hasButton && (
            <div className="filter-button">
              <button
                className="a-btn"
                title="Close filters"
                onClick={() => dispatch(updateFilterVisibility())}
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
            desc="This is how the company responded. For example,
                'Closed with explanation'."
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
            title="How did the consumer submit the complaint to the CFPB?"
            fieldName="submitted_via"
            desc=""
          />
          <hr />
          <SimpleFilter title="Tags" desc={descTags} fieldName="tags" />
        </section>
      )}
    </div>
  );
};
