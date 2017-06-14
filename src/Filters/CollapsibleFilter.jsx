import React from 'react';
import './CollapsibleFilter.less';

export default class CollapsibleFilter extends React.Component {
  render() {
    return (
      <section className="collapsible-filter">
          <div className="layout-row">
            <h5 className="flex-all">{this.props.title}</h5>
            <div className="flex-fixed toggle">
                <a>Hide</a>
                <span className="cf-icon cf-icon-minus-round"></span>
            </div>
          </div>
          <p>{this.props.desc}</p>
          {this.props.children}
      </section>
    );
  }
}
