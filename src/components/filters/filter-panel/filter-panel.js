import './filter-panel.scss';
import { Company } from '../company/company';
import { CompanyReceivedFilter } from '../date/company-received-filter';
import { useSelector } from 'react-redux';
import { Heading } from '@cfpb/design-system-react';
import { DateFilter } from '../date/date-filter';
import { FederalState } from '../federal-state/federal-state';
import { SimpleFilter } from '../simple-filter/simple-filter';
import { ZipCode } from '../zip-code/zip-code';
import { selectViewHasFilters } from '../../../reducers/view/selectors';
import { NestedFilter } from '../nested-filter/nested-filter';

export const FilterPanel = () => {
  const hasFilters = useSelector(selectViewHasFilters);
  const descPublicResponse =
    "The company's optional public-facing response to a consumer's complaint.";
  const descTags =
    'Data that supports easier searching and sorting of complaints submitted by or on behalf of consumers.';

  return (
    <>
      {!!hasFilters && (
        <section className="filter-panel o-well">
          <Heading type="3">Filter results by</Heading>
          <DateFilter />
          <hr />
          <NestedFilter
            desc="The type of product and sub-product the consumer identified in the complaint."
            fieldName="product"
          />
          <hr />
          <NestedFilter
            desc="The issue and sub-issue the consumer identified in the complaint."
            fieldName="issue"
          />
          <hr />
          <FederalState />
          <hr />
          <ZipCode />
          <hr />
          <Company />
          <hr />
          <SimpleFilter
            title="Did the company provide a timely response?"
            desc=""
            fieldName="timely"
          />
          <hr />
          <SimpleFilter
            title="Company response to consumer"
            desc="The company's response to the consumer's complaint."
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
            title="How did the consumer submit the complaint to the CFPB?"
            fieldName="submitted_via"
            desc=""
          />
          <hr />
          <SimpleFilter title="Tags" desc={descTags} fieldName="tags" />
        </section>
      )}
    </>
  );
};
