const formatDeclaration = declaration => {
  const declarations = Object.keys(declaration).map(key => `${key}: ${declaration[key]};`);
  return declarations;
};
export default formatDeclaration;
