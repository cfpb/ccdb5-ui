import React from 'react'

export class Select extends React.Component {
  render() {
    const id = 'choose-' + this.props.id

    // handle cases where an array is passed in
    const values = Array.isArray( this.props.values ) ?
      Object.assign(
        {},
        ...this.props.values.map( value => ( {
          [value]: value
        } ) ) ) :
      this.props.values
    return (
      <section className="cf-select">
        <label className="u-visually-hidden"
               htmlFor={ id }>
          { this.props.label }
        </label>
        <p>
          { this.props.title }
        </p>
        <select value={ this.props.value } id={ id }
                onChange={ this.props.handleChange }>
          { Object.keys( values ).map( x =>
              <option key={ x } value={ x }>{ values[x] }</option>
            ) }
        </select>
      </section>
    )
  }
}

export default Select;
