import mergeWith from 'lodash/mergeWith';

/**
 * Helper function to merge new property values into objects. For properties that are
 * arrays or objects, instead of being combined like the default behavior of _.merge(),
 * the source property is replaced by the destination object property
 *
 * @param {object} destinationObject - is the object with new properties
 * @param {object} mergeSource - is the old object
 */
export function merge(destinationObject, mergeSource) {
  mergeWith(destinationObject, mergeSource, (arg) => arg);
}
