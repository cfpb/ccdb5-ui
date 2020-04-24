import iconMap from '../components/iconMap'

describe('getIcon', () => {
  it( 'gets a known icon', () => {
    const res = iconMap.getIcon( 'minus-round' )
    expect( JSON.stringify(res) ).toEqual( '{"type":"svg","key":null,"ref":null,"props":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1000 1200","className":"cf-icon-svg","children":{"type":"path","key":null,"ref":null,"props":{"d":"M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm263.1 550.7H236c-27.6 0-50-22.4-50-50s22.4-50 50-50h527.1c27.6 0 50 22.4 50 50s-22.4 50-50 50z"},"_owner":null,"_store":{}}},"_owner":null,"_store":{}}' )
  } )

  it( 'handles a unknown icons', () => {
    expect( ()=>{ iconMap.getIcon( 'bogus' ) }).toThrow( 'Icon not found!' )
  } )

})

