import process from './index';

const processFunction = functionNode => {
  let functionName = '';
  let functionArgs = '';
  functionNode.value.forEach(v => {
    if (['identifier', 'pseudo_class'].indexOf(v.type) >= 0) {
      functionName = process(v);
    } else if (v.type === 'arguments') {
      functionArgs = process(v);
    }
  });

  return `${functionName}(${functionArgs})`;
};

export default processFunction;
