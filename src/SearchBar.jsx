import React from 'react'
import { connect } from 'react-redux'
import search from './actions/search'
import Typeahead, { MODE_OPEN } from './Typeahead'
import './SearchBar.less'

const searchFields = {
  'all': 'All Data',
  'company': 'Company Name',
  'complaint_what_happened': 'Narratives'
}

export class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.searchText,
      searchField: props.searchField
    }

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._handleSubmit = this._handleSubmit.bind(this)
    this._onInputChange = this._onInputChange.bind(this)
    this._onSelectSearchField = this._onSelectSearchField.bind(this)
    this._onTypeaheadSelected = this._onTypeaheadSelected.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue: nextProps.searchText,
      searchField: nextProps.searchField
    })
  }

  // This prevents a duplicate update that seems to be triggered on page load
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) !== JSON.stringify(nextState)
  }

  render() {
    return (
        <nav className="search-bar">
          <form action="" onSubmit={this._handleSubmit}>
            <h5>Search Within</h5>
            <div className="layout-row">
              <div className="cf-select">
                <select aria-label="Choose which field will be searched"
                        id="searchField"
                        onChange={this._onSelectSearchField}
                        value={this.state.searchField}>
                  <optgroup label="Search Within">
                  { 
                    Object.keys(searchFields).map(x => {
                      return (
                        <option key={x} value={x}>{searchFields[x]}</option>
                      )
                    })
                  }
                  </optgroup>
                </select>
              </div>
              <div className="flex-all typeahead-portal">
                <Typeahead mode={MODE_OPEN}
                           onInputChange={this._onInputChange}
                           onOptionSelected={this._onTypeaheadSelected}
                           placeholder="Enter your search term(s)"
                           renderOption={this._renderOption}
                           textBoxProps={({
                             "aria-label": "The term to search for",
                             id: "searchText"
                           })}
                           value={this.state.inputValue}
                />
              </div>

              <button type="submit"
                      className="a-btn"
                      ref={(elem) => { this.submitButton = elem }}>
                  Search
                  <span className="a-btn_icon
                                   a-btn_icon__on-right
                                   cf-icon
                                   cf-icon__after
                                   cf-icon-search"></span>
              </button>              
            </div>
          </form>
        </nav>
    )
  }

  // --------------------------------------------------------------------------
  // Event Handlers

  _handleSubmit(event) {
    event.preventDefault()
    this.props.onSearch(this.state.inputValue, this.state.searchField)
  }

  _onSelectSearchField(event) {
    this.setState({
      searchField: event.target.value
    })
  }

  // --------------------------------------------------------------------------
  // Typeahead interface

  _onInputChange(value) {
    const n = value.toLowerCase()

    // Find the matches
    const filtered = (this.props.forTypeahead || [])
      .filter(x => x.normalized.indexOf(n) !== -1)
      .map(x => {
        return {
          key: x.key,
          position: x.normalized.indexOf(n),
          value
        }
      })

    // Sort the matches so that matches at the beginning of the string
    // appear first
    filtered.sort((a,b) => {
      return a.position - b.position
    })

    return new Promise((resolve) => {
       setTimeout(() => {resolve(filtered)}, 1000)
    })
  }

  _renderOption(obj) {
    const start = obj.key.substring(0, obj.position)
    const match = obj.key.substr(obj.position, obj.value.length)
    const end = obj.key.substring(obj.position + obj.value.length)

    return {
      value: obj.key,
      component: (
        <span>{start}<b>{match}</b>{end}</span>
      )
    }
  }

  _onTypeaheadSelected(obj) {
    this.setState({
      inputValue: (typeof obj === 'object') ? obj.key: obj
    })
    this.submitButton.focus()
  }
}

export const mapStateToProps = state => {
  const forTypeahead = ['Bank', 'Credit', 'Loan', 'Mortgage', 'Report']
    .map(x => ({
      key: x,
      normalized: x.toLowerCase()
    }))

  return {
    searchText: state.query.searchText,
    searchField: state.query.searchField,
    forTypeahead
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    onSearch: (text, searchField) => {
      dispatch(search(text, searchField))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
