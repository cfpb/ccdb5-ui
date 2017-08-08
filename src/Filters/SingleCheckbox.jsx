import { connect } from 'react-redux'
import { filterChanged } from '../actions/filter'
import React from 'react'

export class SingleCheckbox extends React.Component {
  constructor(props) {
    super(props);

    this.is_checked = this.props.active || false

    this._toggleCheckbox = this._toggleCheckbox.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      is_checked: nextProps.active
    });
  }

  _toggleCheckbox() {    
    filterChanged(this.props.fieldName, this.is_checked)
    this.is_checked = !this.is_checked
  }

  render() {
    return (
      <section className="single-checkbox">
        <h5>{this.props.title}</h5>
        <div className="m-form-field m-form-field__checkbox">
            <ul>
              <li className="flex-fixed layout-row">
                  <input type="checkbox" className="flex-fixed"
                         aria-label="Yes"
                         checked={this.props.active}
                         onClick={this._toggleCheckbox}
                  />
                  <span className="flex-all bucket-key">Yes</span>
              </li>
            </ul>
        </div>
      </section>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  // Find all query filters that refer to the field name
  const activeChildren = state.query[ownProps.fieldName] || []

  return {
    active: activeChildren.length > 0
  }
}

export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(filterChanged(ownProps.fieldName, ownProps.active))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleCheckbox)
