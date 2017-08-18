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
                  <input className="a-text-input example-input first"
                          type="text" readOnly value="Credit AND Card"/>
                  <input className="a-text-input example-input"
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
                  <input className="a-text-input example-input first"
                          type="text" readOnly value="pay*"/>
                  <input className="a-text-input example-input"
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
                  <input className="a-text-input example-input first"
                          type="text" readOnly value="+foreclosure"/>
                  <input className="a-text-input example-input"
                          type="text" readOnly
                          value="-&#34;debt collector&#34;" />
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
                  <input className="a-text-input example-input_full"
                          type="text" readOnly
                          value="&#34;Loan default&#34;~3"/>
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
                  <input className="a-text-input example-input_full"
                          type="text" readOnly value="Mortgage~2"/>
                  <div className="tip-description">
                    <p>
                      Use ~[#] to search for terms that are similar to your
                      keyword terms within a certain margin of error
                      (~1 catches 80% of spelling errors)
                    </p>
                  </div>
                </div>
                <div className="tip">
                  <h4>Boost Search</h4>
                  <input className="a-text-input example-input_full"
                          type="text" readOnly value="pay^2 bill"/>
                  <div className="tip-description">
                    <p>
                      Use ~2 after a term to boost its relevance above the
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
