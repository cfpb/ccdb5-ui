import ComplaintDetail from './components/ComplaintDetail';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
/* eslint-disable camelcase */

export class DetailComponents extends React.Component {
  render() {
    const complaint_id = this.props.match.params.id;

    return (
      <IntlProvider locale="en">
        <main role="main">
          <ComplaintDetail complaint_id={complaint_id} />
        </main>
      </IntlProvider>
    );
  }
}

/* eslint-enable camelcase */

DetailComponents.propTypes = {
  match: PropTypes.object.isRequired,
};
