import '../../typeahead/typeahead.scss';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import { filterAdded } from '../../../actions';
import PropTypes from 'prop-types';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';
import { SLUG_SEPARATOR } from '../../../constants';
import { normalize, sanitizeHtmlId } from '../../../utils';
import { ClearButton } from '../../typeahead/clear-button/clear-button';
import { HighlightingOption } from '../../typeahead/highlighting-option/highlighting-option';
import { Icon } from '@cfpb/design-system-react';

export const FilterSearch = ({ fieldName }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const fieldNameNew = fieldName.replaceAll('_', ' ');
  const { data, error } = useGetAggregations();
  const aggResults = error || !data ? [] : data[fieldName] || [];
  const subaggName = `sub_${fieldName}.raw`.toLowerCase();
  const buckets = [];

  const [inputText, setInputText] = useState('');

  for (const option of aggResults) {
    if (buckets.every((item) => item.key !== option.key)) {
      const parentAgg = {
        ...option,
        isParent: true,
        label: option.key,
        normalized: normalize(option.key),
        position: 0,
        top: {
          key: option.key,
          label: option.key,
          normalized: normalize(option.key),
          position: 0,
        },
      };
      buckets.push(parentAgg);
    }

    if (Object.hasOwn(option, subaggName) && option[subaggName]?.buckets) {
      const subBuckets = option[subaggName].buckets;
      for (const bucket of subBuckets) {
        const item = {
          key: option.key + SLUG_SEPARATOR + bucket.key,
          label: bucket.key,
          normalized: normalize(bucket.key),
          position: 0,
          top: {
            key: option.key,
            label: option.key,
            normalized: normalize(option.key),
            position: 0,
          },
        };
        buckets.push(item);
      }
    }
  }

  const [dropdownOptions, setDropdownOptions] = useState(buckets);

  const handleClear = () => {
    ref.current.clear();
    setInputText('');
  };

  const handleInputChange = (value) => {
    setInputText(value);
    const rawValue = normalize(value);

    if (rawValue) {
      const options = buckets.map((opt) => {
        return {
          ...opt,
          position: opt.normalized.indexOf(rawValue),
          value,
          top: {
            ...opt.top,
            position: opt.top.normalized.indexOf(rawValue),
            value,
          },
        };
      });

      setDropdownOptions(options);
    } else {
      setDropdownOptions(buckets);
    }
  };

  const handleSelections = (selected) => {
    dispatch(filterAdded(fieldName, selected[0].key));
    handleClear();
  };

  return (
    <div className="typeahead">
      <div className="o-search-input">
        <div className="o-search-input__input">
          <label
            aria-label={'Search ' + fieldName}
            className="o-search-input__input-label"
            htmlFor={sanitizeHtmlId(`filter-search-${fieldName}`)}
          >
            <Icon name="search" isPresentational />
          </label>
          <Typeahead
            id={sanitizeHtmlId(`filter-search-${fieldName}`)}
            maxResults={5}
            minLength={2}
            className="typeahead__selector"
            filterBy={['key']}
            onChange={(selected) => handleSelections(selected)}
            onInputChange={(text) => handleInputChange(text)}
            placeholder=""
            labelKey="key"
            options={dropdownOptions}
            ref={ref}
            inputProps={{
              'aria-label': `${fieldNameNew} Filter Menu Input`,
              className: 'a-text-input a-text-input--full',
            }}
            renderMenuItemChildren={(option) => (
              <li className="typeahead__option typeahead__option--multi">
                <HighlightingOption key={option.value} {...option.top} />
                {option.isParent ? null : (
                  <div className="typeahead__option-sub">
                    {option.value ? (
                      <HighlightingOption key={option.value} {...option} />
                    ) : null}
                  </div>
                )}
              </li>
            )}
          />
          {!!inputText && <ClearButton onClear={handleClear} />}
        </div>
      </div>
    </div>
  );
};

FilterSearch.propTypes = {
  fieldName: PropTypes.string.isRequired,
};
