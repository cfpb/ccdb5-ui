/* NOTES:
at-rule-no-unknown -
  This rule enforces only @ rules that appear in the CSS spec,
  however, @plugin appears in Less, so should be ignored.
color-function-notation -
  Set to 'legacy' to support older browsers in our browserslist (for now).
declaration-block-no-redundant-longhand-properties -
  Turned off.
  TODO: Turn on this rule and work out longhand properties.
declaration-empty-line-before -
  Turned off.
  TODO: Turn on this rule and work out what style we want.
declaration-property-value-no-unknown -
  Turned off for Less per documentation guidance.
function-no-unknown -
  Ignore the 'unit' helper function that comes from Less.
media-feature-range-notation -
  Prefer prefixed values, since Less doesn't support ranges.
media-query-no-invalid -
  Turned off because of https://github.com/ssivanatarajan/stylelint-less/issues/6
no-descending-specificity -
  Turned off, but probably shouldn't be.
  TODO: Turn on this rule and see if issues can be fixed.
number-max-precision -
  TODO: See if long decimal values can be shortened using the unit helper.
rule-empty-line-before -
  Custom setting that differs from stylelint-config-standard.
selector-id-pattern -
  Turned off.
  TODO: Turn on this rule and work out regex for BEM syntax.
selector-class-pattern -
  Turned off.
  TODO: Turn on this rule and work out regex for BEM syntax.
less/color-no-invalid-hex
less/no-duplicate-variables
  Both of the above settings are turned off till
  https://github.com/ssivanatarajan/stylelint-less/issues/6 is addressed.
*/
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['packages/**/node_modules/**/*.scss'],
  rules: {
    'at-rule-no-unknown': null,
    'color-function-notation': ['modern', { ignore: ['with-var-inside'] }],
    'declaration-block-no-redundant-longhand-properties': null,
    'declaration-empty-line-before': null,
    'declaration-property-value-no-unknown': null,
    'media-feature-range-notation': ['prefix'],
    'no-descending-specificity': null,
    'number-max-precision': 10,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: 'first-nested',
        ignore: ['after-comment', 'inside-block'],
      },
    ],
    'selector-id-pattern': null,
    'selector-class-pattern': [
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
      { resolveNestedSelectors: true },
    ],
    'scss/operator-no-newline-after': null,
    'scss/comment-no-empty': null,
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
  },
};
