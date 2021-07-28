# Consumer Complaint Database - 5.0

**Description**:
This application allows consumers to search complaints submitted to the CFPB by other consumers.

#### Technology Stack
This application is written in JavaScript and [Less](http://lesscss.org) within
the [React](https://facebook.github.io/react/) + [Redux](http://redux.js.org/) 
framework.  It uses [Webpack](http://webpack.github.io/docs/) at runtime to 
manage module loading.

The code is written with the [ES6](http://es6-features.org/) feature set
of JavaScript. Backwards compatibility is achieved by compiling the script with
[Babel](https://babeljs.io/) prior to using it within the browser.

Unit testing of the application is performed within
[Jest](https://facebook.github.io/jest/) with
[Enzyme](http://airbnb.io/enzyme/index.html) providing support for event testing.

[npm](https://www.npmjs.com/) is used to manage the build/test/deploy cycle.

The `ccdb5_ui` (note the underscore) directory contains a thin [Django](https://www.djangoproject.com/)
implementation that allows it to be used as a plugin for
[CFPB's public website](https://github.com/cfpb/consumerfinance.gov).

#### Screenshot
![screen August 17, 2017](documentation/screenshot.png)

## Dependencies

This application depends on the following third-party components:

1. [Capital Framework](https://cfpb.github.io/capital-framework/) - CFPB standard styling and controls
1. [History](https://github.com/reacttraining/history) - Integrating the address bar with the application
1. [moment](https://momentjs.com/) - Better date handling than native JavaScript

It also contains portions adapted from:

1. [react-typeahead](https://github.com/fmoo/react-typeahead)

## Installation

Instructions on how to install, configure, and get the project running
are in the [INSTALL](INSTALL.md) document.

## Configuration

Please see the subsection Configuring in [INSTALL](INSTALL.md#configuring)

## Usage

#### Developing code

###### Prerequisites
This application depends on the [Public Complaints API](https://github.com/cfpb/ccdb5-api)
to be available.

For local development, you will need to the following:
* [Get a local version of consumerfinance.gov running](https://github.com/cfpb/consumerfinance.gov#quickstart)
* [Fill the local Elasticsearch with data](https://github.com/cfpb/ccdb-data-pipeline)
* _(optional)_ [Install the API](https://github.com/cfpb/ccdb5-api)
  * Once it is cloned, make sure the website knows the plugin is available. Look under "Loading Sibling Projects, option 2" [here](https://cfpb.github.io/consumerfinance.gov/development-tips/)

###### Code-Build cycle

To run the app in development mode:

```bash
npm start
```

Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

Enter `Control-C` to exit development mode

## How to test the software

#### Unit testing
To launch the JavaScript test runner in interactive watch/test mode:

```bash
npm test
```

Enter `Control-C` to exit interactive watch mode

To run the Python unit tests, first install [Tox](https://tox.readthedocs.io/en/latest/),
and then run:

```bash
tox
```

## Cypress integration tests

Our broswer-based tests check base-line user operations for [consumer complaint search](https://www.consumerfinance.gov/data-research/consumer-complaints/search/). The tests are meant to be run 
against a consumerfinance.gov website that has access to an Elasticsearch index of consumer complaints. 
Tests can be run in a local environment, or they can be run against an external server.

Using a Chrome browser helps avoid some inconsistencies with Cypress's default Electron browser, which currently isn't on the latest 
version of Chrome.

Timeouts and the local `baseUrl` are set in cypress.json

### To run Cypress tests locally

- Set your node env to development:
```bash
export NODE_ENV=development
```
You can run the tests in headless mode and just see results, or you can open the Cypress test-runner, which lets you choose tests and watch them run in a Chrome browser. Having the live browser allows you to see page state during tests, and you can open Chrome dev tools to check console errors and network requests.

To run local tests and just see results:

```bash
yarn run cypress run --browser chrome --headless
```

To open a local Cypress test-runner to choose which tests to run and see the browser interactions:

```bash
yarn run cypress open --browser chrome
```

### To run against a server
You can also run Cypress tests against a server by passing a `baseUrl` config with the path to the server's consumer complaints search page.  

**Note**: If you run against a server that has Django's `DEBUG=False` setting, the tests will probably run into API throttling, which will make tests fail. 
Our internal DEV servers can be deployed with `DEBUG=True` for running Cypress tests.

```bash
yarn run cypress run --browser chrome --headless --config baseUrl=https://[DEV SERVER URL]/data-research/consumer-complaints/search/
```

## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this
repository's [Issue Tracker](https://github.com/cfpb/ccdb5-ui/issues).

## Getting involved

[CONTRIBUTING](CONTRIBUTING.md).

----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


----

## Links that were helpful

#### React-Redux
* https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree
* https://medium.com/lexical-labs-engineering/redux-best-practices-64d59775802e
* https://medium.com/@kylpo/redux-best-practices-eef55a20cc72
* https://github.com/markerikson/react-redux-links/blob/main/tips-and-best-practices.md
* https://getstream.io/blog/react-redux-best-practices-gotchas/
* https://tech.affirm.com/redux-patterns-and-anti-patterns-7d80ef3d53bc
* https://github.com/gaearon/redux-devtools
