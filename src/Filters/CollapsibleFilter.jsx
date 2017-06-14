import React from 'react';
import './CollapsibleFilter.less';

export default class CollapsibleFilter extends React.Component {
  render() {
    let composeClasses = 'collapsible-filter';
    if (this.props.className) {
      composeClasses += ' ' + this.props.className;
    }

    return (
      <section className={composeClasses}>
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
