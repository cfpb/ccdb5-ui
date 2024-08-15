export const arrayEquals = (first, second) => {
  let length = first.length;
  if (length !== second.length) return false;
  while (length--) {
    if (first[length] !== second[length]) return false;
  }
  return true;
};

/**
 * Function to compare two objects or arrays.
 *
 * @param {object | Array | any} first - value 1 to convert to string
 * @param {object | Array | any} second - value 2 to convert to string to compare
 * @returns {boolean} Whether the values are equal
 */
export const isEqual = (first, second) =>
  JSON.stringify(first) === JSON.stringify(second);
