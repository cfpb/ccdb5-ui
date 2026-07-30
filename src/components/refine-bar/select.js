import PropTypes from 'prop-types';
import { useMemo } from 'react';

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
        return values.map((val) => ({
          name: val,
          value: val,
          disabled: val.disabled,
        }));
      }
    } else {
      // case 3
      return Object.keys(values).map((obj) => ({
        name: values[obj],
        value: obj,
        disabled: obj.disabled,
      }));
    }
  }, [values]);

  return (
    <section className="cf-select" data-tour={idSelect}>
      <label className="u-visually-hidden" htmlFor={idSelect}>
        {label}
      </label>
      <p>{title}</p>
      <select value={value} id={idSelect} onChange={handleChange}>
        {vals.map((val) => (
          <option
            disabled={[val.value, val.name].includes(value) || val.disabled}
            key={val.name}
            value={val.value || val.name}
          >
            {val.name}
          </option>
        ))}
      </select>
    </section>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  title: PropTypes.string,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
