// To mock globally in all your tests, add to setupTestFrameworkScriptFile in config:
// https://facebook.github.io/jest/docs/en/configuration.html#setuptestframeworkscriptfile-string
const moment = require('moment-timezone');
jest.doMock('moment', () => {
    moment.tz.setDefault('America/New_York');
    return moment;
});
