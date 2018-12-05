import process from './index';

const processAtrule = rule => {
  const breakdown = {};
  rule.value.forEach(v => {
    switch (v.type) {
    case 'atkeyword':
      breakdown.keyword = process(v);
      break;
    case 'identifier':
      breakdown.identifier = process(v);
      break;
    case 'arguments':
      breakdown.arguments = process(v);
      break;
    case 'string_double':
      breakdown.arguments = process(v);
      break;
    case 'block':
      breakdown.declarations = process(v);
      break;
    default:
      break; // Do nothing for unknown types
    }
  });
  return breakdown;
};
export default processAtrule;
