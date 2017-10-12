/* eslint complexity: ["error", 6] */

import PropTypes from 'prop-types'
import React from 'react'

export class MoreOrLess extends React.Component {
  constructor( props ) {
    super( props )
    this.state = { showMore: props.showMore }
    this._toggleShowMore = this._toggleShowMore.bind( this )
  }

  _buildListComponent( bucket ) {
    const itemProps = this.props.perBucketProps( bucket,
      {
        ...this.props.listComponentProps,
        item: bucket,
        key: bucket.key
      }
    )

    return <this.props.listComponent {...itemProps} />
  }

  _toggleShowMore() {
    this.setState( {
      showMore: !this.state.showMore
    } )
  }

  render() {
    const all = this.props.options
    const some = all.length > 5 ? all.slice( 0, 5 ) : all
    const remain = all.length - 5

    return (
      <div>
        <ul>
        {this.state.showMore ?
          all.map( bucket => this._buildListComponent( bucket ) ) :
          some.map( bucket => this._buildListComponent( bucket ) )
        }
        </ul>
        {remain > 0 ?
          <div>
               <button className="a-btn a-btn__link more"
                       onClick={ this._toggleShowMore }>
                  + Show {remain} {this.state.showMore ? 'less' : 'more'}
                </button>
          </div> :
         null}
      </div>
    )
  }
}

MoreOrLess.propTypes = {
  listComponent: PropTypes.oneOfType( [
    PropTypes.element,
    PropTypes.func
  ] ).isRequired,
  listComponentProps: PropTypes.object,
  options: PropTypes.array.isRequired,
  perBucketProps: PropTypes.func,
  showMore: PropTypes.bool
}

MoreOrLess.defaultProps = {
  listComponentProps: {},
  perBucketProps: ( bucket, props ) => props,
  showMore: false
}

export default MoreOrLess
