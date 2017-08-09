 /**
 * This method builds an anchor tag
 * @param {string} uri The url for the link
 * @param {string} download (optional) the value of the `download` attribute
 * @returns {Element} an unattached element created by the DOM
 */
export function buildLink( uri, download = null ) {
  const link = document.createElement( 'a' )
  link.href = uri
  link.target = '_blank'
  if ( download ) {
    link.download = download
  }

  return link
}

 /**
 * This method simulates a user click of an anchor tag
 * @param {Element} link a link built with {@link buildLink}
 */
export function simulateClick( link ) {
  document.body.appendChild( link )
  link.click()
  document.body.removeChild( link )
}
