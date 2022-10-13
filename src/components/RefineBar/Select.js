import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

export const Select = ({ id, handleChange, label, title, value, values }) => {
  const idSelect = 'select-' + id;
  const vals = useMemo(() => {
    // different cases that values can me:
    // Array
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

    if (Array.isArray(values)) {
      // do nothing, case 2
      if (Object.prototype.hasOwnProperty.call(values[0], 'name')) {
        return values;
      } else {
        // case 1
        return values.map((o) => ({
          name: o,
          value: o,
          disabled: o.disabled,
        }));
      }
    } else {
      // case 3
      return Object.keys(values).map((o) => ({
        name: values[o],
        value: o,
        disabled: o.disabled,
      }));
    }
  }, [values]);

  console.log(values, value);
  return (
    <section className="cf-select" data-tour={idSelect}>
      <label className="u-visually-hidden" htmlFor={idSelect}>
        {label}
      </label>
      <p>{title}</p>
      <select value={value} id={idSelect} onChange={handleChange}>
        {vals.map((x) => (
          <option
            disabled={[x.value, x.name].includes(value) || x.disabled}
            key={x.name}
            value={x.value || x.name}
          >
            {x.name}
          </option>
        ))}
      </select>
    </section>
  );
};

export default Select;

Select.propTypes = {
  id: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  title: PropTypes.string,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
