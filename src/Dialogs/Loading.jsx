import './Loading.less'
import PropTypes from 'prop-types'
import React from 'react'

export default class Loading extends React.Component {
  render() {
    return this.props.isLoading ?
      <section className="light-box">
        <div className="loading-box">
          <span className="cf-icon
                           cf-icon-update
                           cf-icon__before
                           cf-icon__spin">
          </span>
          <span>This page is loading</span>
        </div>
      </section> :
     null
  }
}

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

Loading.defaultProps = {
}
