import '../../Typeahead/Typeahead.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import { filterAdded } from '../../../actions';
import PropTypes from 'prop-types';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { SLUG_SEPARATOR } from '../../../constants';
import { ClearButton } from '../../Typeahead/ClearButton/ClearButton';

export const FilterSearch = ({ fieldName }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState('');
  const fieldNameNew = fieldName.replace(/_/g, ' ');
  const { data } = useGetAggregations();

  const aggResults = data[fieldName] || [];
  const subaggName = `sub_${fieldName}.raw`.toLowerCase();
  const buckets = [];
  aggResults.forEach((option) => {
    buckets.push(option);
    if (option[subaggName] && option[subaggName].buckets) {
      option[subaggName].buckets.forEach((bucket) => {
        const item = {
          key: option.key + SLUG_SEPARATOR + bucket.key,
          value: bucket.key,
        };
        buckets.push(item);
      });
    }
  });

  const handleClear = () => {
    ref.current.clear();
    setInputText('');
  };

  const handleSelections = (selected) => {
    dispatch(filterAdded(fieldName, selected[0].key));
    handleClear();
  };

  // give the input focus when the component renders the first time
  useEffect(() => {
    ref.current.focus();
  }, [ref]);

  return (
    <section className="typeahead">
      <div className="o-search-input">
        <div className="o-search-input__input">
          <Typeahead
            id={'filter-search' + fieldName}
            minLength={2}
            className="typeahead-selector"
            filterBy={['key']}
            onChange={(selected) => handleSelections(selected)}
            onInputChange={(text) => setInputText(text)}
            placeholder={'Enter name of ' + fieldNameNew}
            labelKey="key"
            options={buckets}
            ref={ref}
            inputProps={{
              'aria-label': `${fieldNameNew} Filter Menu Input`,
            }}
            renderMenuItemChildren={(option) => (
              <div>
                {option.key.split(SLUG_SEPARATOR)[0]}
                {option.value ? (
                  <div>
                    <small>{option.value}</small>
                  </div>
                ) : null}
              </div>
            )}
          />
          {!!inputText && <ClearButton onClear={handleClear} />}
        </div>
      </div>
    </section>
  );
};

FilterSearch.propTypes = {
  fieldName: PropTypes.string.isRequired,
};
