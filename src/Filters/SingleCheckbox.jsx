import React from 'react';

export default class SingleCheckbox extends React.Component {
  render() {
    return (
      <section className="single-checkbox">
        <h5>{this.props.title}</h5>
        <div className="m-form-field m-form-field__checkbox">
            <input className="a-checkbox" type="checkbox" id="theCheckbox" />
            <label className="a-label" htmlFor="theCheckbox">{this.props.label}</label>
        </div> 
      </section>
    );
  }
}
