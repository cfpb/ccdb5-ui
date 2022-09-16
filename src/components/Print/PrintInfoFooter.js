import React from 'react';

export default class PrintInfoFooter extends React.Component {
  render() {
    return (
      <section className="print-info-footer">
        <p>
          <span>URL:</span> {window.location.href}
        </p>
      </section>
    );
  }
}
