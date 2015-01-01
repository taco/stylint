/**
 * check for names-like-this vs namesLikeThis or NamesLikeThis vs names_like_this
 * @param {string} [line] the line to be tested
 * @param {string} [convention] the naming convention to test againt. can be 'camelCase'|'underscore'|'dash'
 * @returns true, false, or undefined true if convention correct, false if not, undefined if line not testable
 */

var cssCheck = /^[$#.]+/, // we dont care about default css names, only look at vars, classes, ids, etc
    camel = /^[$.#]+[a-zA-Z][a-z]+([.A-Z0-9]+[a-z =]+)+\b/, // camelCase or CamelCase
    dash = /^[$.#]+[a-z]+(-[.a-z]+)+\b/, // lower-case-dashes-only
    score = /^[$.#]+[a-z]+(_[.a-z]+)+\b/; // lower_case_underscores_only

module.exports = function checkNamingConvention( line, convention ) {
    // only run checks if on a class, id, or variable
    if ( cssCheck.test(line) ) {
        if ( convention === 'camelCase' ) {
            if ( camel.test(line) && !dash.test(line) && !score.test(line) ) {
                return true;
            }
            else {
                return false;
            }
        }
        else if ( convention === 'lowercase-underscore' ) {
            if ( !camel.test(line) && !dash.test(line) && score.test(line) ) {
                return true;
            }
            else {
                return false;
            }
        }
        else if ( convention === 'lowercase-dash' ) {
            if ( !camel.test(line) && dash.test(line) && !score.test(line) ) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}