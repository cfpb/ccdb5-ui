/*
THIS FILE IS MODIFIED FROM
https://github.com/cfpb/design-system/blob/main/stylelint.config.js
*/

/* NOTES:
at-rule-no-unknown -
  This rule enforces only @ rules that appear in the CSS spec,
  however, @plugin appears in Less, so should be ignored.


function-parentheses-space-inside -
  Custom setting that differs from stylelint-config-standard.

no-descending-specificity -
  Turned off, but probably shouldn't be.
  TODO: Turn on this rule and see if issues can be fixed.

rule-empty-line-before -
  Custom setting that differs from stylelint-config-standard.

less/color-no-invalid-hex
less/no-duplicate-variables
  Both of the above settings are turned off till
  https://github.com/ssivanatarajan/stylelint-less/issues/6 is addressed.

*/
module.exports = {
  extends: 'stylelint-config-recommended-less',
  ignoreFiles: ['coverage/**/*.css'],
  customSyntax: 'postcss-less',
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: 'plugin' }],
    'function-name-case': ['lower', { ignoreFunctions: ['filter'] }],
    'length-zero-no-unit': true,
    'no-descending-specificity': null,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: 'first-nested',
        ignore: ['after-comment', 'inside-block'],
      },
    ],
    'less/color-no-invalid-hex': null,
    'less/no-duplicate-variables': null,
  },
};
