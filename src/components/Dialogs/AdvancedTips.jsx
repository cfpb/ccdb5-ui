import './AdvancedTips.less';
import React from 'react';

export default class AdvancedTips extends React.Component {

  render() {
    return (
      <nav className="advanced_tips">
        <div className="o-expandable">
          <div className="o-expandable_content
              o-expandable_content__onload-open">
            <h3>Advanced search tips</h3>
            <div className="tips">
              <div className="tip">
                <h4>And/Or</h4>
                <label className="u-visually-hidden" htmlFor="example-and">
                    Use AND when results must contain both terms
                </label>
                <input className="a-text-input example-input first"
                  id="example-and"
                  type="text" readOnly value="Credit AND Card"/>
                <label className="u-visually-hidden" htmlFor="example-or">
                    Use OR when results should contain at least one of the terms
                </label>
                <input className="a-text-input example-input"
                  id="example-or"
                  type="text" readOnly value="Loan OR Mortgage"/>
                <div className="tip-description">
                  <p>
                      Use AND when results must contain both terms
                  </p>
                  <p>
                      Use OR when results should contain at least one of the
                      terms
                  </p>
                </div>
              </div>
              <div className="tip">
                <h4>Wildcard search</h4>
                <label className="u-visually-hidden"
                  htmlFor="example-wc-star">
                    Use * after a few letters or a word to show results that
                    start with those letters or word
                </label>
                <input className="a-text-input example-input first"
                  id="example-wc-star"
                  type="text" readOnly value="pay*"/>
                <label className="u-visually-hidden"
                  htmlFor="example-wc-question">
                    Use ? to show results where the “?” is replaced by any
                    character
                </label>
                <input className="a-text-input example-input"
                  id="example-wc-question"
                  type="text" readOnly value="Mort?age"/>
                <div className="tip-description">
                  <p>
                      Use * after a few letters or a word to
                       show results that start with those letters or word
                  </p>
                  <p>
                      Use ? to show results where the “?” is
                      replaced by any character
                  </p>
                </div>
              </div>
              <div className="tip">
                <h4>Must/must not contain</h4>
                <label className="u-visually-hidden"
                  htmlFor="example-must-plus">
                    Use + if the search must contain the term
                </label>
                <input className="a-text-input example-input first"
                  id="example-must-plus"
                  type="text" readOnly value="+foreclosure"/>
                <label className="u-visually-hidden"
                  htmlFor="example-must-minus">
                    Use - if the search must not contain the term
                </label>
                <input className="a-text-input example-input"
                  id="example-must-minus"
                  type="text" readOnly
                  value='-&#34;debt collector&#34;'/>
                <div className="tip-description">
                  <p>
                      Use + if the search must contain the term
                  </p>
                  <p>
                      Use - if the search must not contain the term
                  </p>
                </div>
              </div>
              <div className="tip">
                <h4>Proximity Search</h4>
                <label className="u-visually-hidden"
                  htmlFor="example-proximity">
                    Use ~[#] to search for two words within that number of
                    characters from one another; the words should be in
                    quotation marks
                </label>
                <input className="a-text-input example-input_full"
                  id="example-proximity"
                  type="text" readOnly
                  value='&#34;Loan default&#34;~3'/>
                <div className="tip-description">
                  <p>
                      Use ~[#] to search for two words within that number of
                      characters from one another; the words should be in
                      quotation marks
                  </p>
                </div>
              </div>
              <div className="tip">
                <h4>Fuzzy Search</h4>
                <label className="u-visually-hidden"
                  htmlFor="example-fuzzy">
                    Use ~ to search for terms that are similar to your
                    keyword term to catch spelling errors. Note that this
                    only works with single words (not phrases)
                </label>
                <input className="a-text-input example-input_full"
                  id="example-fuzzy"
                  type="text" readOnly value="Mortgage~"/>
                <div className="tip-description">
                  <p>
                      Use ~ to search for terms that are similar to your
                      keyword term to catch spelling errors. Note that this
                      only works with single words (not phrases)
                  </p>
                </div>
              </div>
              <div className="tip">
                <h4>Boost Search</h4>
                <label className="u-visually-hidden"
                  htmlFor="example-boost">
                    Use ^2 after a term to boost its relevance above the
                    other term
                </label>
                <input className="a-text-input example-input_full"
                  id="example-boost"
                  type="text" readOnly value="pay^2 bill"/>
                <div className="tip-description">
                  <p>
                      Use ^2 after a term to boost its relevance above the
                      other term
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
