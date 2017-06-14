import React from 'react';
import './SearchBar.less';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.searchText
    };

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._handleSubmit = this._handleSubmit.bind(this);
    this._updateInputValue = this._updateInputValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue: nextProps.searchText
    });
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.props.onSearch(this.state.inputValue);
  }

  _updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  render() {
    return (
        <nav className="searchBar">
          <h2>Search Complaint Data</h2>
          <form action="" onSubmit={this._handleSubmit}>
            <label className="a-label a-label__heading">Search Within</label>
            <input type="button" className="btn" value="Types" />
            <input type="text"
                   value={this.state.inputValue}
                   onChange={this._updateInputValue}
                   placeholder="Enter your search term(s)" />
            <input type="submit" className="btn primary" value="Search" />
          </form>
        </nav>
    );
  }
}
