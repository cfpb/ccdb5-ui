import React from 'react'
import { connect } from 'react-redux'
import search from './actions/search'
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
    this._updateInputValue = this._updateInputValue.bind(this)
    this._onSelectSearchField = this._onSelectSearchField.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue: nextProps.searchText,
      searchField: nextProps.searchField
    })
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
              <input type="text"
                     aria-label="The term to search for"
                     className="flex-all"
                     id="searchText"
                     onChange={this._updateInputValue}
                     placeholder="Enter your search term(s)"
                     value={this.state.inputValue}
              />
              <button className="a-btn" type="submit">
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

  _updateInputValue(event) {
    this.setState({
      inputValue: event.target.value
    })
  }
}

export const mapStateToProps = state => {
  return {
    searchText: state.query.searchText,
    searchField: state.query.searchField
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
