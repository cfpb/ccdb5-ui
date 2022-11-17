import './AdvancedTips.less';
import React from 'react';
import { TooltipWrapper } from '../../Common/TooltipWrapper/TooltipWrapper';

export const AdvancedTips = () => {
  return (
    <div className="advanced_tips">
      <div className="o-expandable">
        <div className="o-expandable_content o-expandable_content__onload-open">
          <h3>Search tips</h3>
          <ul className="m-list">
            <li className="m-list_item">
              Hover over the examples within the sample search bars below to see
              what their results should return
            </li>
            <li className="m-list_item">
              When searching within &quot;All data,&quot; terms must be found in
              the same field to be considered a match
            </li>
            <li className="m-list_item">
              The search function will look for any variations of the word that
              includes the stem – for example, if deferment is searched, it
              would return the following variations: deferment, defer, deferred,
              deferral, etc.
            </li>
          </ul>
        </div>
        <div className="o-expandable_content o-expandable_content__onload-open">
          <div className="tips content-l">
            <div className="tip content-l_col content-l_col-1-3">
              <h4>AND / OR / NOT</h4>
              <label className="u-visually-hidden" htmlFor="example-and">
                Use AND when results must contain all terms
              </label>
              <TooltipWrapper text="Results would include both call (call, called, calling, etc.) as well as harass (harass, harassed, harassing, etc.).">
                <input
                  className="a-text-input example-input"
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
                  className="a-text-input example-input"
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
                  className="a-text-input example-input"
                  id="example-not"
                  type="text"
                  readOnly
                  value="claim NOT accident"
                />
              </TooltipWrapper>
              <div className="tip-description">
                <p>Use AND when results must contain both terms</p>
                <p>
                  Use OR when results should contain at least one of the terms
                </p>
                <p>Use NOT when results must not contain the term</p>
              </div>
            </div>
            <div className="tip content-l_col content-l_col-1-3">
              <h4>Must/must not contain</h4>
              <label className="u-visually-hidden" htmlFor="example-must-plus">
                Use + if the search must contain the selected term
              </label>
              <TooltipWrapper text="Results must include the word foreclosure (foreclosure, foreclosed, etc.).">
                <input
                  className="a-text-input example-input"
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
                  className="a-text-input example-input"
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
            </div>
            <div className="tip content-l_col content-l_col-1-3">
              <h4>Wildcard search</h4>
              <label className="u-visually-hidden" htmlFor="example-wc-star">
                Use * to substitute any consecutive number of characters.
              </label>
              <TooltipWrapper text='Results would include all terms that start with the base "report" (report, reports, reported, reporting, etc.) and "$*.00" would include all variations of whole number dollar values ($8.00, $1234.00, etc.).'>
                <input
                  className="a-text-input example-input"
                  id="example-wc-star"
                  type="text"
                  readOnly
                  value="report* AND $*.00"
                />
              </TooltipWrapper>
              <label
                className="u-visually-hidden"
                htmlFor="example-wc-question"
              >
                Use ? to replace any single character anywhere in a term.
              </label>
              <TooltipWrapper text="Results would return variations such as: woman, women, etc.">
                <input
                  className="a-text-input example-input"
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
            <div className="tip content-l_col content-l_col-1-3">
              <h4>Proximity Search</h4>
              <label className="u-visually-hidden" htmlFor="example-proximity">
                Use ~[#] at the end of a phrase to search for terms with up to
                that number of gap words between them; Order does not matter and
                the terms should be in a single set of quotation marks (&quot;
                &quot;).
              </label>
              <TooltipWrapper text='Results would include the terms "auto", "loan", and "default" in any order, with up to three (3) gap words in between them. For example, results could include: "defaulted auto loan", "auto loan that went into default", "Auto Loan with the same defaulted", etc.'>
                <input
                  className="a-text-input example-input_full"
                  id="example-proximity"
                  type="text"
                  readOnly
                  value='"auto loan default"~3'
                />
              </TooltipWrapper>
              <div className="tip-description">
                <p>
                  Use ~[#] at the end of a phrase to search for terms with up to
                  that number of gap words between them; Order does not matter
                  and the terms should be in a single set of quotation marks
                  (&quot; &quot;).
                </p>
              </div>
            </div>
            <div className="tip content-l_col content-l_col-1-3">
              <h4>Fuzzy Search</h4>
              <label className="u-visually-hidden" htmlFor="example-fuzzy">
                Use ~1 at the end of a term to search for terms that are spelled
                similarly to your keyword within a certain margin of error.
              </label>
              <TooltipWrapper text="Results would include the correct spelling of escrow, as well as other (potentially misspelled) versions, such as: escrow, escrowed, escro, esrow, etc.">
                <input
                  className="a-text-input example-input_full"
                  id="example-fuzzy"
                  type="text"
                  readOnly
                  value="escrow~1"
                />
              </TooltipWrapper>
              <div className="tip-description">
                <p>
                  Use ~1 at the end of a term to search for terms that are
                  spelled similarly to your keyword within a certain margin of
                  error.
                </p>
              </div>
            </div>
            <div className="tip content-l_col content-l_col-1-3">
              <h4>Boost Search</h4>
              <label className="u-visually-hidden" htmlFor="example-boost">
                Use ^[#] at the end of a term or terms to increase or decrease
                its relevance compared to the other term(s).
              </label>
              <TooltipWrapper text='Results would be sorted by relevance in favor of the term "pay"'>
                <input
                  className="a-text-input example-input_full"
                  id="example-boost"
                  type="text"
                  readOnly
                  value="pay^2 OR credit"
                />
              </TooltipWrapper>
              <div className="tip-description">
                <p>
                  Use ^[#] at the end of a term or terms to increase or decrease
                  its relevance compared to the other term(s).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
