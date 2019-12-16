import iconMap from '../iconMap'

describe('getIcon', () => {
  it( 'gets a known icon', () => {
    const res = iconMap.getIcon( 'minus-round' )
    expect( res ).toContain( '<path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm263.1 550.7H236c-27.6 0-50-22.4-50-50s22.4-50 50-50h527.1c27.6 0 50 22.4 50 50s-22.4 50-50 50z" />' )
  } )

  it( 'handles a unknown icons', () => {
    const t = () => {
      throw new Error( 'Icon not found!' )
    };
    expect( ()=>{ iconMap.getIcon( 'bogus' ) }).toThrow( 'Icon not found!' )
  } )

})

