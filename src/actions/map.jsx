export const STATE_TOGGLED = 'STATE_TOGGLED'

/**
 * Creates an action in response after states results fails
 *
 * @param {string} selectedState the tile map state that is toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function toggleState( selectedState ) {
  return {
    type: STATE_TOGGLED,
    selectedState
  }
}
