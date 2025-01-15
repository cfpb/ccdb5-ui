import '../../Typeahead/Typeahead.scss';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import { filterAdded } from '../../../actions';
import PropTypes from 'prop-types';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { SLUG_SEPARATOR } from '../../../constants';
import { normalize } from '../../../utils';
import { ClearButton } from '../../Typeahead/ClearButton/ClearButton';
import { HighlightingOption } from '../../Typeahead/HighlightingOption/HighlightingOption';
import getIcon from '../../Common/Icon/iconMap';

export const FilterSearch = ({ fieldName }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const fieldNameNew = fieldName.replace(/_/g, ' ');
  const { data } = useGetAggregations();

  const aggResults = data[fieldName] || [];
  const subaggName = `sub_${fieldName}.raw`.toLowerCase();
  const buckets = [];

  const [inputText, setInputText] = useState('');

  aggResults.forEach((option) => {
    if (buckets.findIndex((item) => item.key === option.key) === -1) {
      const parentAgg = { ...option };
      parentAgg.isParent = true;
      parentAgg.label = option.key;
      parentAgg.normalized = normalize(option.key);
      parentAgg.position = 0;
      parentAgg.top = {
        key: option.key,
        label: option.key,
        normalized: normalize(option.key),
        position: 0,
      };
      buckets.push(parentAgg);
    }

    if (option[subaggName] && option[subaggName].buckets) {
      option[subaggName].buckets.forEach((bucket) => {
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
      });
    }
  });

  const [dropdownOptions, setDropdownOptions] = useState(buckets);

  const handleClear = () => {
    ref.current.clear();
    setInputText('');
  };

  const handleInputChange = (value) => {
    setInputText(value);
    const rawValue = normalize(value);

    if (!rawValue) {
      setDropdownOptions(buckets);
    } else {
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
            htmlFor={'filter-search' + fieldName}
          >
            {getIcon('search')}
          </label>
          <Typeahead
            id={'filter-search' + fieldName}
            maxResults={5}
            minLength={2}
            className="typeahead-selector"
            filterBy={['key']}
            onChange={(selected) => handleSelections(selected)}
            onInputChange={(text) => handleInputChange(text)}
            placeholder={'Enter name of ' + fieldNameNew}
            labelKey="key"
            options={dropdownOptions}
            ref={ref}
            inputProps={{
              'aria-label': `${fieldNameNew} Filter Menu Input`,
              className: 'a-text-input a-text-input--full',
            }}
            renderMenuItemChildren={(option) => (
              <li className="typeahead-option typeahead-option--multi body-copy">
                <HighlightingOption {...option.top} />
                {!option.isParent ? (
                  <div className="typeahead-option__sub">
                    {option.value ? <HighlightingOption {...option} /> : null}
                  </div>
                ) : null}
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
