/** @module lib/display */

import util from 'util';

const config = {
  display: false,
  log: false,
  debug: false,
};

/** Enable console message displays */
export const enableDisplay = () => { config.display = true; };
/** Enable log message displays */
export const enableLog = () => { config.log = true; };
/** Enable debug message displays */
export const enableDebug = () => { config.debug = true; };
/** Disable console message displays */
export const disableDisplay = () => { config.display = false; };
/** Disable log message displays */
export const disableLog = () => { config.log = false; };
/** Disable debug message displays */
export const disableDebug = () => { config.debug = false; };

const testAndOutput = (test, output) => {
  if (test) {
    console.log(output); // eslint-disable-line no-console
  }
  return true;
};

/**
 * Display a message to the console
 * @param {string} output - The message to be displayed
 */
export const display = output => (testAndOutput(config.display, output));
/**
 * Display a log message
 * @param {string} output - The log message to be displayed
 */
export const log = output => (testAndOutput(config.log, output));
/**
 *
 * Display a variable's debug data
 * @param {*} output - The object to be output
 * @param {string} header - A topper for the output data (will also add divider to bottom)
 */
export const debug = (output, header) => {
  const inspectData = util.inspect(output, { showHidden: false, depth: null });
  let finalOutput = inspectData;
  if (header) {
    const dividingLine = '='.repeat(25);
    finalOutput = ['\n\n', header, dividingLine, inspectData, dividingLine].join('\n');
  }
  testAndOutput(config.debug, finalOutput);
};
