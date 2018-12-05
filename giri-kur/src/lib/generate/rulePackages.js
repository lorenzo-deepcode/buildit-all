const selectorName = selector => selector[0];
const pseudoClassName = selector => selector[1] || '*';

const generateRulePackages = (allRules) => {
  const packages = {};

  const establishElement = (elementName) => {
    if (!packages[elementName]) {
      packages[elementName] = {};
    }
  };

  const establishPseudo = (pseudoName, elementName) => {
    establishElement(elementName);
    if (!packages[elementName][pseudoName]) {
      packages[elementName][pseudoName] = [];
    }
  };

  const updateDeclarations = (elementName, pseudoName, declarations) => {
    establishPseudo(pseudoName, elementName);
    packages[elementName][pseudoName].push(...declarations);
  };

  allRules.forEach(rule => {
    const selector = selectorName(rule.selector);
    const pseudo = pseudoClassName(rule.selector);
    const declarations = rule.declarations;
    updateDeclarations(selector, pseudo, declarations);
  });

  return packages;
};
export default generateRulePackages;
