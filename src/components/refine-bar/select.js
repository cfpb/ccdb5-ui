import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { SelectSingle } from '@cfpb/design-system-react';

/**
 * Normalize legacy refine-bar value shapes into DSR SelectOption[].
 *
 * @param {Array|object} values - Array of strings/objects, or value→label map
 * @returns {{ label: string, value: string, disabled: boolean }[]}
 */
const toOptions = (values) => {
  if (Array.isArray(values)) {
    if (
      values[0] &&
      Object.prototype.hasOwnProperty.call(values[0], 'name')
    ) {
      return values.map((val) => ({
        label: val.name,
        value: String(val.value ?? val.name),
        disabled: Boolean(val.disabled),
      }));
    }
    return values.map((val) => ({
      label: String(val),
      value: String(val),
      disabled: false,
    }));
  }

  return Object.entries(values).map(([key, optionLabel]) => ({
    label: optionLabel,
    value: key,
    disabled: false,
  }));
};

/**
 * Refine-bar select backed by DSR SelectSingle (`.a-select`).
 * Falls back to the same DS markup when an option must be disabled
 * (SelectSingle does not yet support per-option disabled).
 *
 * @param {object} props - Component props
 * @param {string} props.id - Select id suffix (`select-${id}`)
 * @param {Function} props.handleChange - Change handler (`{ target: { value } }`)
 * @param {string} [props.label] - Accessible label fallback
 * @param {string} [props.title] - Visible heading label (preferred)
 * @param {string|number} props.value - Current value
 * @param {Array|object} props.values - Options
 * @returns {import('react').JSX.Element} Select field
 */
export const Select = ({ id, handleChange, label, title, value, values }) => {
  const idSelect = 'select-' + id;
  const options = useMemo(() => toOptions(values), [values]);
  const hasDisabledOptions = options.some((option) => option.disabled);
  const visibleLabel = title || label;

  const currentValue = String(value ?? '');

  const onChange = (selected) => {
    if (!selected?.value || selected.value === currentValue) {
      return;
    }
    handleChange({ target: { value: selected.value } });
  };

  if (hasDisabledOptions) {
    return (
      <section data-tour={idSelect} className="refine-select">
        <div className="m-form-field">
          <label className="a-label a-label--heading" htmlFor={idSelect}>
            {visibleLabel}
          </label>
          <div className="a-select">
            <select
              id={idSelect}
              data-testid={idSelect}
              value={currentValue}
              onChange={(event) => {
                if (event.target.value === currentValue) {
                  return;
                }
                handleChange({ target: { value: event.target.value } });
              }}
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-tour={idSelect} className="refine-select">
      <SelectSingle
        id={idSelect}
        label={visibleLabel}
        options={options.map(({ label: optionLabel, value: optionValue }) => ({
          label: optionLabel,
          value: optionValue,
        }))}
        value={currentValue}
        onChange={onChange}
      />
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
