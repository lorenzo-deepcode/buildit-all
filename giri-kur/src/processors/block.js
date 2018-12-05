import process, { stripSpaces } from './index';

const processBlock = block => {
  const lines = stripSpaces(block.value);
  return lines.map(l => {
    const { token } = process(l);
    return token;
  }).filter(l => !!l);
};

export default processBlock;
