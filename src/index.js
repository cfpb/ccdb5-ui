/**
 * The application's entry point
 *
 * @param {string} err - An error object if a problem occurred during load
 */
function main() {
  const App = require('./App').App;
  const ReactDOM = require('react-dom');
  const React = require('react');

  ReactDOM.render(<App />, document.getElementById('ccdb-ui-root'));
}

main();
