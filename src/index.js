import 'core-js/es/array';
import 'core-js/es/object';
import 'core-js/es/set';

/* eslint-disable global-require */

/**
 * Checks for specific features in the browser
 *
 * @returns {boolean} true if the current browser supports Intl
 */
function browserSupportsAllFeatures() {
  return window.Intl;
}

/**
 * Adds a script tag to the current HTML page
 *
 * @param {string} src - the JS url to add to the page
 * @param {Function} done - the method to call after the external script loads
 */
function loadScript(src, done) {
  const js = document.createElement('script');
  js.src = src;
  js.onload = function () {
    done();
  };
  js.onerror = function () {
    done(new Error('Failed to load script ' + src));
  };
  document.head.appendChild(js);
}

/**
 * The application's entry point
 *
 * @param {string} err - An error object if a problem occurred during load
 */
function main(err) {
  if (err) {
    // eslint-disable-next-line no-alert
    alert('There was a problem on the page: ', err);
  } else {
    const App = require('./App').App;
    const ReactDOM = require('react-dom');
    const React = require('react');

    ReactDOM.render(<App />, document.getElementById('ccdb-ui-root'));
  }
}

if (browserSupportsAllFeatures()) {
  // Browsers that support all features run `main()` immediately.
  main();
} else {
  // All other browsers loads polyfills and then run `main()`
  const url =
    'https://cdn.polyfill.io/v2/polyfill.min.js?' +
    'features=default,Intl.~locale.en';
  loadScript(url, main);
}
