/** @module processors */
import processAttribute from './attribute';
import processClass from './class';
import processRule from './rule';
import processBlock from './block';
import processDeclaration from './declaration';
import processFunction from './function';
import processSelector from './selector';
import processOperator from './operator';
import processId from './id';
import processValue from './value';
import processColorHex from './color_hex';
import processComment from './comment';
import processVariable from './variable';
import processPseudoClass from './pseudoclass';
import processArguments from './arguments';
import processAtrule from './atrule';
import processAtkeyword from './atkeyword';
import * as tokenTypes from './types';

export const types = tokenTypes;

const processors = {
  attribute: processAttribute,
  class: processClass,
  rule: processRule,
  block: processBlock,
  declaration: processDeclaration,
  function: processFunction,
  selector: processSelector,
  operator: processOperator,
  id: processId,
  value: processValue,
  color_hex: processColorHex,
  comment_multiline: processComment,
  comment_singleline: processComment,
  variable: processVariable,
  pseudo_class: processPseudoClass,
  arguments: processArguments,
  atrule: processAtrule,
  atkeyword: processAtkeyword,
};
/**
 * Takes a node from the scss-parser library and returns something usable as part of
 * a style key inside a design token.
 * @param {Object} node - A node in the scss-parser format
 */
const process = node => {
  const n = node.node ? node.node : node; // Seriously?  This is a thing we have to do?
  let returnValue;
  if (processors[n.type]) {
    returnValue = processors[n.type](n);
  } else if (n.value) {
    returnValue = n.value;
  } else {
    returnValue = n;
  }
  return returnValue;
};

export const stripSpaces = collection => (
  collection.filter(c => (c.type !== 'space'))
);

export default process;
