/**
 * function to capitalize only first letter of word
 * yolo => Yolo
 *
 * @param {string} input - string we want to capitalize.
 * @returns {string} string with capitalized first letter
 */
export const capitalize = (input) =>{
  return input ? input.charAt(0).toUpperCase() + input.slice(1) : "";
}
