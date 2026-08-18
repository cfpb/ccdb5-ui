import type { ChangeEvent, KeyboardEvent } from 'react';
import { Icon, Button } from '@cfpb/design-system-react';
import { ClearButton } from '../clear-button/clear-button';

interface InputProps {
  ariaLabel: string;
  className?: string;
  htmlId: string;
  isDisabled?: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
  handlePressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
}

export const Input = ({
  ariaLabel,
  className = '',
  htmlId,
  isDisabled = false,
  handleChange,
  handleClear,
  handlePressEnter,
  placeholder = 'Enter your search text',
  value,
}: InputProps) => {
  return (
    <div className="o-search-input">
      <div className="o-search-input__input">
        <label
          htmlFor={htmlId}
          className="o-search-input__input-label"
          aria-label={ariaLabel}
        >
          <Icon name="search" isPresentational />
        </label>
        <input
          type="search"
          id={htmlId}
          disabled={isDisabled}
          value={value}
          onChange={handleChange}
          onKeyDown={handlePressEnter}
          className={'a-text-input a-text-input--full ' + className}
          placeholder={placeholder}
          title={placeholder || ariaLabel}
          autoComplete="off"
          maxLength={75}
        />
        <ClearButton onClear={handleClear!} />
      </div>
      <Button type="submit" label="Search" />
    </div>
  );
};
