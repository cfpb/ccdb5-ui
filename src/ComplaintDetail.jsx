import React from 'react';

export default class ComplaintDetail extends React.Component {
  render() {
    return (
      <div>
        <p>THE COMPLAINT ID YOU HAVE REQUESTED IS: { this.props.complaint_id }</p>
      </div>
    );
  }
}
