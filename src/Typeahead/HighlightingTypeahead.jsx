import HighlightingOption from './HighlightingOption'
import { normalize } from '../utils'
import PropTypes from 'prop-types'
import React from 'react'
import Typeahead from '.'

export const compileOptions = options => options.map( x => ( {
  key: x,
  normalized: normalize( x )
} ) )

export default class HighlightingTypeahead extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      compiled: compileOptions( props.options )
    }
    this._onInputChange = this._onInputChange.bind( this )
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( {
      compiled: compileOptions( nextProps.options )
    } )
  }

  render() {
    return (
      <Typeahead {...this.props}
                 onInputChange={this._onInputChange}
                 renderOption={this._renderOption}
      />
    )
  }

  _onInputChange( value ) {
    // Normalize the input value
    const normalized = normalize( value )

    // Find the matches
    const filtered = this.state.compiled
      .filter( x => x.normalized.indexOf( normalized ) !== -1 )
      .map( x => ( {
        key: x.key,
        label: x.key,
        position: x.normalized.indexOf( normalized ),
        value
      } ) )

    // Sort the matches so that matches at the beginning of the string
    // appear first
    filtered.sort( ( a, b ) => a.position - b.position )

    return filtered
  }

  _renderOption( obj ) {
    return {
      value: obj.key,
      component: <HighlightingOption {...obj} />
    }
  }
}

HighlightingTypeahead.propTypes = {
  disabled: PropTypes.bool,
  maxVisible: PropTypes.number,
  minLength: PropTypes.number,
  onOptionSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf( PropTypes.string ).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string
}

HighlightingTypeahead.defaultProps = {
  disabled: false,
  maxVisible: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
  value: ''
}
