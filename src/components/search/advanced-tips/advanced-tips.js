import './advanced-tips.scss';
import { TooltipWrapper } from '../../common/tooltip-wrapper/tooltip-wrapper';
import { ComplexExample } from './complex-example';
import PropTypes from 'prop-types';
import {
  Heading,
  Label,
  Link,
  List,
  ListItem,
  Paragraph,
  TextInput,
} from '@cfpb/design-system-react';

const ExampleInput = ({ id, label, tooltip, value, className }) => (
  <>
    <Label isInline className="u-visually-hidden" htmlFor={id}>
      {label}
    </Label>
    <TooltipWrapper text={tooltip}>
      <TextInput id={id} className={className} readOnly value={value} />
    </TooltipWrapper>
  </>
);

ExampleInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const AdvancedTips = () => {
  return (
    <div className="advanced-tips">
      <div>
        <Heading type="3">Search tips</Heading>
        <List>
          <ListItem>
            Hover over the examples within the sample search bars below to see
            what their results should return
          </ListItem>
          <ListItem>
            When searching within &quot;All data&quot;, terms must be found in
            the same field to be considered a match
          </ListItem>
          <ListItem>
            The search function will look for any variations of the word that
            includes the stem – for example, if deferment is searched, it would
            return the following variations: deferment, defer, deferred,
            deferral, etc.
          </ListItem>
        </List>
      </div>
      <div className="tips content-l">
        <div className="tip content-l__col content-l__col-1-3">
          <Heading type="4">AND / OR / NOT</Heading>
          <ExampleInput
            id="example-and"
            label="Use AND when results must contain all terms"
            tooltip="Results would include both call (call, called, calling, etc.) as well as harass (harass, harassed, harassing, etc.)."
            value="call AND harass"
          />
          <ExampleInput
            id="example-or"
            label="Use OR when results should contain at least one of the terms"
            tooltip="Results would include either loan (loan, loans, loaned, etc.) or mortage (mortgage, mortgages, etc.)."
            value="loan OR mortgage"
          />
          <ExampleInput
            id="example-not"
            label="Use NOT when results should contain at least one of the terms"
            tooltip="Results would only include claim (claim, claims, claimed, etc.) and cannot include the term accident (accident, accidents, etc.)"
            value="claim NOT accident"
          />
          <div className="tip-description">
            <Paragraph>Use AND when results must contain both terms</Paragraph>
            <Paragraph>
              Use OR when results should contain at least one of the terms
            </Paragraph>
            <Paragraph>
              Use NOT when results must not contain the term
            </Paragraph>
          </div>
          <ComplexExample
            id="and-or-not"
            notes={[
              'The Boolean operators (AND / OR / NOT) must be capitalized',
              'Boolean operators do not honor precedence rules, so parentheses should be used whenever multiple operators are used together – if they are not used correctly (i.e., having multiple operators outside of parentheses), then your results might not return what you intended.',
            ]}
            placeholderText="call AND (harass* OR annoy* OR threat OR repeat) AND NOT spam"
            tooltipText="This example would return results that include the word call (called, calling, etc.) and one of the words in the parentheses, but exclude the word spam (spammed, spamming, etc.)."
          />
        </div>
        <div className="tip content-l__col content-l__col-1-3">
          <Heading type="4">Must/Must not contain</Heading>
          <ExampleInput
            id="example-must-plus"
            label="Use + if the search must contain the selected term"
            tooltip="Results must include the word foreclosure (foreclosure, foreclosed, etc.)."
            value="+foreclosure"
          />
          <ExampleInput
            id="example-must-minus"
            label="Use - if the search must not contain the selected term"
            tooltip="Results cannot include the word collect (collect, collects, collecting, etc.)."
            value="-collect"
          />
          <div className="tip-description">
            <Paragraph>
              Use + if the search must contain the selected term
            </Paragraph>
            <Paragraph>
              Use - if the search must not contain the selected term
            </Paragraph>
          </div>
          <ComplexExample
            id="must-or-must-not"
            notes={[
              'Since the terms "insurance" and "claim" do not have to be included in the results, their appearance will give the result a greater relevance score.',
              'There cannot be a space between the operator (+ / -) and searched term.',
            ]}
            placeholderText="insurance claim +agent +car -accident"
            tooltipText="Results must include the terms agent and car but exclude accident – the terms insurance and claim are optional"
          />
        </div>
        <div className="tip content-l__col content-l__col-1-3">
          <Heading type="4">Wildcard search</Heading>
          <ExampleInput
            id="example-wc-star"
            label="Use * to substitute any consecutive number of characters."
            tooltip='Results would include all terms that start with the base "report" (report, reports, reported, reporting, etc.) and "$*.00" would include all variations of whole number dollar values ($8.00, $1234.00, etc.).'
            value="report* AND $*.00"
          />
          <ExampleInput
            id="example-wc-question"
            label="Use ? to replace any single character anywhere in a term."
            tooltip="Results would return variations such as: woman, women, etc."
            value="wom?n"
          />
          <div className="tip-description">
            <Paragraph>
              Use * to substitute any consecutive number of characters.
            </Paragraph>
            <Paragraph>
              Use ? to replace any single character anywhere in a term.
            </Paragraph>
          </div>
        </div>
        <div className="tip content-l__col content-l__col-1-3">
          <Heading type="4">Proximity search</Heading>
          <ExampleInput
            id="example-proximity"
            className="example-input"
            label='Use ~[#] at the end of a phrase to search for terms with up to that number of gap words between them; Order does not matter and the terms should be in a single set of quotation marks (" ").'
            tooltip='Results would include the terms "auto", "loan", and "default" in any order, with up to three (3) gap words in between them. For example, results could include: "defaulted auto loan", "auto loan that went into default", "Auto Loan with the same defaulted", etc.'
            value='"auto loan default"~3'
          />
          <div className="tip-description">
            <Paragraph>
              Use ~[#] at the end of a phrase to search for terms with up to
              that number of gap words between them; Order does not matter and
              the terms should be in a single set of quotation marks (&quot;
              &quot;).
            </Paragraph>
          </div>
          <ComplexExample
            id="proximity"
            notes={[
              'Proximity phrase search must use straight quotes (" ") versus curly quotes (“ ”), or else the search function will not perform properly',
              'The closer the specified terms are within the data, the more relevant the search results become.',
            ]}
          />
        </div>
        <div className="tip content-l__col content-l__col-1-3">
          <Heading type="4">Fuzzy search</Heading>
          <ExampleInput
            id="example-fuzzy"
            className="example-input"
            label="Use ~1 at the end of a term to search for terms that are spelled similarly to your keyword within a certain margin of error."
            tooltip="Results would include the correct spelling of escrow, as well as other (potentially misspelled) versions, such as: escrow, escrowed, escro, esrow, etc."
            value="escrow~1"
          />
          <div className="tip-description">
            <Paragraph>
              Use ~1 at the end of a term to search for terms that are spelled
              similarly to your keyword within a certain margin of error.
            </Paragraph>
          </div>
          <ComplexExample
            id="fuzzy"
            notes={[
              'The search looks for a maximum of two changes in the term, where a change is the insertion, deletion or substitution of a single character or transposition of two adjacent characters (this catches about 80% of misspelled words).',
              'Fuzzy term search can only be used with single terms, it does not support phrases.',
            ]}
            placeholderText="escrow~1 -escrow -escrowed"
            tooltipText='Results would return the various misspellings of the word "escrow" that fuzzy term search identifies (after excluding the escrow and escrowed).'
          />
        </div>
        <div className="tip content-l__col content-l__col-1-3">
          <Heading type="4">Boost search</Heading>
          <ExampleInput
            id="example-boost"
            className="example-input"
            label="Use ^[#] at the end of a term or terms to increase or decrease its relevance compared to the other term(s)."
            tooltip='Results would be sorted by relevance in favor of the term "pay"'
            value="pay^2 OR credit"
          />
          <div className="tip-description">
            <Paragraph>
              Use ^[#] at the end of a term or terms to increase or decrease its
              relevance compared to the other term(s).
            </Paragraph>
          </div>
          <ComplexExample
            id="boost"
            notes={[
              'A boost value between 0 and 1.0 decreases the relevance score while a value greater than 1.0 increases the relevance score.',
            ]}
          />
        </div>
      </div>
      <div className="advanced-tips__footer">
        <Heading type="3">Additional notes:</Heading>
        <List>
          <ListItem>
            Putting a phrase only in quotations (&quot; &quot;) will search for
            the words in that order, but it will not be an exact match – meaning
            it may include stemmed versions of the term.
          </ListItem>
          <ListItem>
            The default operator is &quot;AND&quot;, meaning if you search
            &quot;foreclosure house&quot;, it will search results that include
            both words (i.e., foreclosure AND house).
          </ListItem>
          <ListItem>
            Capitalization does not have an effect on searched terms (except for
            the AND / OR / NOT operators).
          </ListItem>
          <ListItem>
            <Link
              to="https://docs.opensearch.org/latest/getting-started/intro/"
              target="_blank"
              rel="noopener noreferrer"
              iconRight="external-link"
              label="Find out more"
            />{' '}
            about OpenSearch
          </ListItem>
        </List>
      </div>
    </div>
  );
};
