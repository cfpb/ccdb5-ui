import PropTypes from 'prop-types';
import React from 'react';

export class Select extends React.Component {
  getValues() {
    // different cases Array
    // handle cases where an array of single entries
    // case 1: values = [1,2,4]
    // case 2: values = [
    // { name: 'Foo', disabled: false},
    // { name:'bar', disabled: true }
    // ]
    // object key val pair
    // case 3: values = {
    //   created_date_desc: 'Newest to oldest',
    //   created_date_asc: 'Oldest to newest',
    //   relevance_desc: 'Relevance',
    //   relevance_asc: 'Relevance (asc)'
    // }
    // array of objects
    let values;

    if (Array.isArray(this.props.values)) {
      // do nothing, case 2
      if (this.props.values[0].hasOwnProperty('name')) {
        values = this.props.values;
      } else {
        // case 1
        values = this.props.values.map((o) => ({
          name: o,
          value: o,
          disabled: false,
        }));
      }
    } else {
      // case 3
      values = Object.keys(this.props.values).map((o) => ({
        name: this.props.values[o],
        value: o,
        disabled: false,
      }));
    }
    return values;
  }

  render() {
    const id = 'select-' + this.props.id;
    const values = this.getValues();

    return (
      <section className={'cf-select'} data-tour={id}>
        <label className="u-visually-hidden" htmlFor={id}>
          {this.props.label}
        </label>
        <p>{this.props.title}</p>
        <select
          value={this.props.value}
          id={id}
          onChange={this.props.handleChange}
        >
          {values.map((x) => (
            <option
              disabled={x.disabled}
              key={x.name}
              value={x.value || x.name}
            >
              {x.name}
            </option>
          ))}
        </select>
      </section>
    );
  }
}

export default Select;

Select.propTypes = {
  id: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  title: PropTypes.string,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
