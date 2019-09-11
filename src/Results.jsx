import { connect } from 'react-redux'
import React from 'react'
import ResultsPanel from './ResultsPanel';
import TrendsPanel from './TrendsPanel';

export class Results extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      tab: props.tab
    };
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( {
      tab: nextProps.tab
    } )
  }
  render() {
    return (
      <div className="content_main">
        {
          this.state.tab === 'List' ? <ResultsPanel/> : <TrendsPanel/>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ( {
  tab: state.view.tab
} )

export default connect( mapStateToProps )( Results )
