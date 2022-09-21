import { connect } from 'react-redux';
import { debounce } from '../utils';
import PropTypes from 'prop-types';
import React from 'react';
import { screenResized } from '../actions/view';

export class WindowSize extends React.Component {
  // This will initialize the application with the window size
  // and then update redux store
  componentDidMount() {
    this.props.updateWindowSize( window.innerWidth );

    window.addEventListener(
      'resize',
      debounce( () => {
        this.props.updateWindowSize( window.innerWidth );
      }, 200 )
    );
  }

  componentDidUpdate() {
    if ( this.props.isPrintMode && this.props.isFromExternal ) {
      setTimeout( function() {
        window.print();
      }, 3000 );
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ( {
  isFromExternal: state.view.isFromExternal,
  isPrintMode: state.view.isPrintMode
} );

export const mapDispatchToProps = dispatch => ( {
  updateWindowSize: size => {
    dispatch( screenResized( size ) );
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( WindowSize );

WindowSize.propTypes = {
  updateWindowSize: PropTypes.func.isRequired,
  isPrintMode: PropTypes.bool,
  isFromExternal: PropTypes.bool
};
