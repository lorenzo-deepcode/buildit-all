import process from './index';
import * as types from './types';

const processDeclaration = declaration => {
  const value = declaration.value;
  let propName;
  let propValue;
  let type = types.DECLARATION;
  value.forEach(v => {
    if (v.type === 'property') {
      propName = v.value.reduce((acc, val) => `${acc}${val.value}`, '');
      if (v.value[0].type === 'variable') {
        propName = `$${propName}`;
        type = types.VARIABLE;
      }
    } else if (v.type === 'value') {
      propValue = process(v);
    }
  });
  const final = {};
  final[propName] = propValue;
  return { token: final, type };
};

export default processDeclaration;
