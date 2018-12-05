import process, { stripSpaces } from './index';

const processAttribute = attribute => {
  const processList = stripSpaces(attribute.value).map(a => process(a)).join('');
  return `[${processList}]`;
};

export default processAttribute;
