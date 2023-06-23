/**
 * Sets the options for the async typeahead
 * @param {string} value - value typed into the typeahead
 * @param {Function} setOptions - function to set local array of options
 * @param {string} uri - the endpoint being hit by the fetch
 */
export function handleFetchSearch(value, setOptions, uri) {
  const n = value.toLowerCase();
  if (n === '') {
    setOptions([]);
    return;
  }
  return fetch(uri)
    .then((result) => result.json())
    .then((items) => {
      const options = items.map((x) => ({
        key: x,
        label: x,
        position: x.toLowerCase().indexOf(n),
        value,
      }));
      setOptions(options);
    });
}
