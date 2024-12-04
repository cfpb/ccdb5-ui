import './AdvancedTips.scss';
import { TooltipWrapper } from '../../Common/TooltipWrapper/TooltipWrapper';
import { ComplexExample } from './ComplexExample';
import getIcon from '../../Common/Icon/iconMap';

export const AdvancedTips = () => {
  return (
    <div className="advanced-tips">
      <div>
        <h3>Search tips</h3>
        <ul className="m-list">
          <li className="m-list__item">
            Hover over the examples within the sample search bars below to see
            what their results should return
          </li>
          <li className="m-list__item">
            When searching within &quot;All data&quot;, terms must be found in
            the same field to be considered a match
          </li>
          <li className="m-list__item">
            The search function will look for any variations of the word that
            includes the stem – for example, if deferment is searched, it would
            return the following variations: deferment, defer, deferred,
            deferral, etc.
          </li>
        </ul>
      </div>
      <div className="tips content-l">
        <div className="tip content-l__col content-l__col-1-3">
          <h4>AND / OR / NOT</h4>
          <label className="u-visually-hidden" htmlFor="example-and">
            Use AND when results must contain all terms
          </label>
          <TooltipWrapper text="Results would include both call (call, called, calling, etc.) as well as harass (harass, harassed, harassing, etc.).">
            <input
              className="a-text-input"
              id="example-and"
              type="text"
              readOnly
              value="call AND harass"
            />
          </TooltipWrapper>
          <label className="u-visually-hidden" htmlFor="example-or">
            Use OR when results should contain at least one of the terms
          </label>
          <TooltipWrapper text="Results would include either loan (loan, loans, loaned, etc.) or mortage (mortgage, mortgages, etc.).">
            <input
              className="a-text-input"
              id="example-or"
              type="text"
              readOnly
              value="loan OR mortgage"
            />
          </TooltipWrapper>
          <label className="u-visually-hidden" htmlFor="example-not">
            Use NOT when results should contain at least one of the terms
          </label>
          <TooltipWrapper text="Results would only include claim (claim, claims, claimed, etc.) and cannot include the term accident (accident, accidents, etc.)">
            <input
              className="a-text-input"
              id="example-not"
              type="text"
              readOnly
              value="claim NOT accident"
            />
          </TooltipWrapper>
          <div className="tip-description">
            <p>Use AND when results must contain both terms</p>
            <p>Use OR when results should contain at least one of the terms</p>
            <p>Use NOT when results must not contain the term</p>
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
          <h4>Must/Must not contain</h4>
          <label className="u-visually-hidden" htmlFor="example-must-plus">
            Use + if the search must contain the selected term
          </label>
          <TooltipWrapper text="Results must include the word foreclosure (foreclosure, foreclosed, etc.).">
            <input
              className="a-text-input"
              id="example-must-plus"
              type="text"
              readOnly
              value="+foreclosure"
            />
          </TooltipWrapper>
          <label className="u-visually-hidden" htmlFor="example-must-minus">
            Use - if the search must not contain the selected term
          </label>
          <TooltipWrapper text="Results cannot include the word collect (collect, collects, collecting, etc.).">
            <input
              className="a-text-input"
              id="example-must-minus"
              type="text"
              readOnly
              value="-collect"
            />
          </TooltipWrapper>
          <div className="tip-description">
            <p>Use + if the search must contain the selected term</p>
            <p>Use - if the search must not contain the selected term</p>
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
          <h4>Wildcard search</h4>
          <label className="u-visually-hidden" htmlFor="example-wc-star">
            Use * to substitute any consecutive number of characters.
          </label>
          <TooltipWrapper text='Results would include all terms that start with the base "report" (report, reports, reported, reporting, etc.) and "$*.00" would include all variations of whole number dollar values ($8.00, $1234.00, etc.).'>
            <input
              className="a-text-input"
              id="example-wc-star"
              type="text"
              readOnly
              value="report* AND $*.00"
            />
          </TooltipWrapper>
          <label className="u-visually-hidden" htmlFor="example-wc-question">
            Use ? to replace any single character anywhere in a term.
          </label>
          <TooltipWrapper text="Results would return variations such as: woman, women, etc.">
            <input
              className="a-text-input"
              id="example-wc-question"
              type="text"
              readOnly
              value="wom?n"
            />
          </TooltipWrapper>
          <div className="tip-description">
            <p>Use * to substitute any consecutive number of characters.</p>
            <p>Use ? to replace any single character anywhere in a term.</p>
          </div>
        </div>
        <div className="tip content-l__col content-l__col-1-3">
          <h4>Proximity search</h4>
          <label className="u-visually-hidden" htmlFor="example-proximity">
            Use ~[#] at the end of a phrase to search for terms with up to that
            number of gap words between them; Order does not matter and the
            terms should be in a single set of quotation marks (&quot; &quot;).
          </label>
          <TooltipWrapper text='Results would include the terms "auto", "loan", and "default" in any order, with up to three (3) gap words in between them. For example, results could include: "defaulted auto loan", "auto loan that went into default", "Auto Loan with the same defaulted", etc.'>
            <input
              className="a-text-input example-input"
              id="example-proximity"
              type="text"
              readOnly
              value='"auto loan default"~3'
            />
          </TooltipWrapper>
          <div className="tip-description">
            <p>
              Use ~[#] at the end of a phrase to search for terms with up to
              that number of gap words between them; Order does not matter and
              the terms should be in a single set of quotation marks (&quot;
              &quot;).
            </p>
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
          <h4>Fuzzy search</h4>
          <label className="u-visually-hidden" htmlFor="example-fuzzy">
            Use ~1 at the end of a term to search for terms that are spelled
            similarly to your keyword within a certain margin of error.
          </label>
          <TooltipWrapper text="Results would include the correct spelling of escrow, as well as other (potentially misspelled) versions, such as: escrow, escrowed, escro, esrow, etc.">
            <input
              className="a-text-input example-input"
              id="example-fuzzy"
              type="text"
              readOnly
              value="escrow~1"
            />
          </TooltipWrapper>
          <div className="tip-description">
            <p>
              Use ~1 at the end of a term to search for terms that are spelled
              similarly to your keyword within a certain margin of error.
            </p>
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
          <h4>Boost search</h4>
          <label className="u-visually-hidden" htmlFor="example-boost">
            Use ^[#] at the end of a term or terms to increase or decrease its
            relevance compared to the other term(s).
          </label>
          <TooltipWrapper text='Results would be sorted by relevance in favor of the term "pay"'>
            <input
              className="a-text-input example-input"
              id="example-boost"
              type="text"
              readOnly
              value="pay^2 OR credit"
            />
          </TooltipWrapper>
          <div className="tip-description">
            <p>
              Use ^[#] at the end of a term or terms to increase or decrease its
              relevance compared to the other term(s).
            </p>
          </div>
          <ComplexExample
            id="boost"
            notes={[
              'A boost value between 0 and 1.0 decreases the relevance score while a value greater than 1.0 increases the relevance score.',
            ]}
          />
        </div>
      </div>
      <div className="footer">
        <h3>Additional notes:</h3>
        <ul className="m-list">
          <li className="m-list__item">
            Putting a phrase only in quotations (&quot; &quot;) will search for
            the words in that order, but it will not be an exact match – meaning
            it may include stemmed versions of the term.
          </li>
          <li className="m-list__item">
            The default operator is &quot;AND&quot;, meaning if you search
            &quot;foreclosure house&quot;, it will search results that include
            both words (i.e., foreclosure AND house).
          </li>
          <li className="m-list__item">
            Capitalization does not have an effect on searched terms (expect for
            the AND / OR / NOT operators).
          </li>
          <li className="m-list__item">
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/7.17/elasticsearch-intro.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find out more {getIcon('external-link')}
            </a>{' '}
            about Elastic Search
          </li>
        </ul>
      </div>
    </div>
  );
};
