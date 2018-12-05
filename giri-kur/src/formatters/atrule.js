import { pd } from 'pretty-data';

import formatDeclaration from './declaration';

const formatImport = everything => `@import "${everything.arguments}";`;

const formatMixin = everything => {
  const formattedDeclarations = formatDeclaration(everything.declarations);
  let argstring = everything.arguments;
  if (everything.arguments.length > 0) {
    argstring = `(${argstring})`;
  }
  return pd.css(`@${everything.keyword} ${everything.identifier}${argstring} {${formattedDeclarations.join('')}}`);
};

const keywordFormatters = {
  '@import': formatImport,
  '@mixin': formatMixin,
};

const formatAtrule = (rule) => {
  let output = '';
  if (keywordFormatters[rule.keyword]) {
    output = keywordFormatters[rule.keyword](rule);
  }

  return output;
};
export default formatAtrule;
