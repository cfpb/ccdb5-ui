/**
 * Sets the options for the async typeahead
 *
 * @param {string} value - value typed into the typeahead
 * @param {Function} setOptions - function to set local array of options
 * @param {string} uri - the endpoint being hit by the fetch
 * @returns {void | Promise<object>} - Either nothing or a response with option object
 */
export function handleFetchSearch(value, setOptions, uri) {
  const num = value.toLowerCase();
  if (num === '') {
    setOptions([]);
    return;
  }
  return fetch(uri)
    .then((result) => result.json())
    .then((items) => {
      const options = items.map((item) => ({
        key: item,
        label: item,
        position: item.toLowerCase().indexOf(num),
        value,
      }));
      setOptions(options);
    });
}
