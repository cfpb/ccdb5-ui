import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { SelectSingle } from '@cfpb/design-system-react';

/**
 * Normalize legacy refine-bar value shapes into DSR SelectOption[].
 * Disabled options are omitted rather than rendered as disabled.
 *
 * @param {Array|object} values - Array of strings/objects, or value→label map
 * @returns {{ label: string, value: string }[]} Options to the select
 */
const toOptions = (values) => {
  if (Array.isArray(values)) {
    if (values[0] && Object.prototype.hasOwnProperty.call(values[0], 'name')) {
      return values
        .filter((val) => !val.disabled)
        .map((val) => ({
          label: val.name,
          value: String(val.value ?? val.name),
        }));
    }
    return values.map((val) => ({
      label: String(val),
      value: String(val),
    }));
  }

  return Object.entries(values).map(([key, optionLabel]) => ({
    label: optionLabel,
    value: key,
  }));
};

/**
 * Refine-bar select backed by DSR SelectSingle.
 *
 * @param {object} props - Component props
 * @param {string} props.id - Select id suffix (`select-${id}`)
 * @param {(event: {target: {value: string}}) => void} props.handleChange - Change handler
 * @param {string} props.label - Visible SelectSingle label
 * @param {string|number} props.value - Current value
 * @param {Array|object} props.values - Options
 * @returns {import('react').JSX.Element} Select field
 */
export const Select = ({ id, handleChange, label, value, values }) => {
  const idSelect = 'select-' + id;
  const options = useMemo(() => toOptions(values), [values]);
  const currentValue = String(value ?? '');

  const onChange = (selected) => {
    if (!selected?.value || selected.value === currentValue) {
      return;
    }
    handleChange({ target: { value: selected.value } });
  };

  return (
    <section data-tour={idSelect} className="refine-select">
      <SelectSingle
        id={idSelect}
        label={label}
        options={options}
        value={currentValue}
        onChange={onChange}
      />
    </section>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
