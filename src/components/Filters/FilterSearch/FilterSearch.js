import '../../Typeahead/Typeahead.scss';
import { /*useEffect, useRef,*/ useState } from 'react';
import { useDispatch } from 'react-redux';
// import { Typeahead } from 'react-bootstrap-typeahead';
// import { AsyncTypeahead } from '../../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { Typeahead } from '../../Typeahead/Typeahead/Typeahead';
import { filterAdded } from '../../../actions';
import PropTypes from 'prop-types';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { SLUG_SEPARATOR } from '../../../constants';
import { normalize } from '../../../utils';
// import { ClearButton } from '../../Typeahead/ClearButton/ClearButton';
// import HighlightingOption from 'components/Typeahead/HighlightingOption/HighlightingOption';
// import getIcon from '../../Common/Icon/iconMap';

export const FilterSearch = ({ fieldName }) => {
  //const ref = useRef();
  const dispatch = useDispatch();

  const fieldNameNew = fieldName.replace(/_/g, ' ');
  const { data } = useGetAggregations();

  const aggResults = data[fieldName] || [];
  const subaggName = `sub_${fieldName}.raw`.toLowerCase();
  const buckets = [];
  aggResults.forEach((option) => {
    if (!option[subaggName]) {
      option.label = option.key;
      option.normalized = normalize(option.key);
      option.position = 0;
      buckets.push(option);
    } else {
      if (option[subaggName] && option[subaggName].buckets) {
        option[subaggName].buckets.forEach((bucket) => {
          const item = {
            key: option.key + SLUG_SEPARATOR + bucket.key,
            label: bucket.key,
            normalized: normalize(bucket.key),
            position: 0,
          };
          buckets.push(item);
        });
      }
    }
  });
  //console.log('inputText: ', inputText);

  //const handleClear = () => {
  //ref.current.clear();
  //setInputText('');
  //};

  //const [inputText, setInputText] = useState('');
  //const starterOptions = [];
  //console.log('buckets: ', buckets)
  const [dropdownOptions, setDropdownOptions] = useState(buckets);

  const handleInputChange = (value) => {
    const rawValue = normalize(value);

    if (!rawValue) {
      setDropdownOptions(buckets);
    } else {
      /*const options = buckets.map((opt) => ({
        key: opt.key,
        value: opt.value,
        label: opt.label,
        position: 0
       // position: opt.label.toLowerCase().indexOf(inputText.toLowerCase()),
       // value,
      }));*/
      const options = buckets.map((opt) => {
        return {
          key: opt.key,
          label: opt.label,
          normalized: opt.normalized,
          position: opt.normalized.indexOf(rawValue),
          value,
        };
      });
      //console.log('options: ', options)
      setDropdownOptions(options);
    }
  };

  const handleSelections = (selected) => {
    dispatch(filterAdded(fieldName, selected[0].key));
    //handleClear();
  };

  // give the input focus when the component renders the first time
  //useEffect(() => {
  // ref.current.focus();
  //}, [ref]);

  return (
    <div /*className="typeahead"*/>
      {/* <div className="o-search-input">
        <div className="o-search-input__input">
          <label
            aria-label={'Search ' + fieldName}
            className="o-search-input__input-label"
            htmlFor={'filter-search' + fieldName}
          >
            {getIcon('search')}
          </label> */}
      <Typeahead
        htmlId={'filter-search-' + fieldName}
        ariaLabel={`${fieldNameNew} Filter Menu Input`}
        hasClearButton={true}
        handleChange={(selected) => handleSelections(selected)}
        handleInputChange={(text) => handleInputChange(text)}
        //handleInputChange={(text) => setInputText(text)}
        options={dropdownOptions}
        placeholder={'Enter name of ' + fieldNameNew}
      />
      {/* <Typeahead
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
               className: 'a-text-input a-text-input--full',
             }}
             renderMenuItemChildren={(option) => (
               <li className="typeahead-option body-copy">
                 {option.key.split(SLUG_SEPARATOR)[0]}
                 {option.value ? (
                   <div>
                     <div className="typeahead-option body-copy">
                       <HighlightingOption {...option} />
                     </div>
                   </div>
                 ) : null}
               </li>
             )}
           /> 
          {!!inputText && <ClearButton onClear={handleClear} />} */}
      {/* </div>
      </div> */}
    </div>
  );
};

FilterSearch.propTypes = {
  fieldName: PropTypes.string.isRequired,
};
