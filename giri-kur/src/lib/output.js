/** @module lib/output */
import generateScss from './generate/scss';

/**
 * Takes token data and outputs an SCSS directory
 * @param {Object[]} globals - Variables
 * @param {Object[]} rules - Any element rules
 */
const outputStyles = (globals, rules) => (generateScss(globals, rules));
export default outputStyles;
