import type { JSX } from 'react';
import { SelectSingle } from '@cfpb/design-system-react';

interface SelectOption {
  label: string;
  value: string;
}

interface NamedSelectValue {
  name: string;
  value?: string | number;
  disabled?: boolean;
}

type SelectValues = string[] | NamedSelectValue[] | Record<string, string>;

export interface SelectChangeEvent {
  target: {
    value: string;
  };
}

export interface SelectProps {
  id?: string;
  handleChange: (event: SelectChangeEvent) => void;
  label: string;
  value?: string | number;
  values: SelectValues;
}

const isNamedSelectValueArray = (
  values: SelectValues,
): values is NamedSelectValue[] =>
  Array.isArray(values) &&
  values.length > 0 &&
  typeof values[0] === 'object' &&
  values[0] !== null &&
  Object.prototype.hasOwnProperty.call(values[0], 'name');

const toOptions = (values: SelectValues): SelectOption[] => {
  if (Array.isArray(values)) {
    if (isNamedSelectValueArray(values)) {
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

export const Select = ({
  id,
  handleChange,
  label,
  value,
  values,
}: SelectProps): JSX.Element => {
  const idSelect = 'select-' + id;
  const options = toOptions(values);
  const currentValue = String(value ?? '');

  const onChange = (
    selected: SelectOption | SelectOption[] | undefined,
  ): void => {
    const next = Array.isArray(selected) ? selected[0] : selected;
    if (!next?.value || next.value === currentValue) {
      return;
    }
    handleChange({ target: { value: next.value } });
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
