import { pd } from 'pretty-data';

import formatDeclaration from './declaration';

const formatSelector = (selector, pseudo = '') => {
  const pseudoString = (!pseudo || pseudo === '*') ? '' : pseudo;
  return `${selector}${pseudoString}`;
};

const formatRule = (selector, declarations) => {
  const allPseudos = Object.keys(declarations);

  const formattedDeclarations = [].concat(...allPseudos.map(p => {
    let formatted = [];
    if (p === '*') {
      formatted = declarations[p].reduce((j, k) => (j.concat(formatDeclaration(k))), []);
    } else {
      formatted = formatRule(formatSelector('&', p), { '*': declarations[p] });
    }
    return formatted;
  }));

  return pd.css(`${formatSelector(selector)} {\n ${formattedDeclarations.join('\n')} \n}`);
};
export default formatRule;
