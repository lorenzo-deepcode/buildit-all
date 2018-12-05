import process, { stripSpaces } from './index';

const distillSelector = fullSelector => {
  const finalSelector = [fullSelector.shift()];
  const pseudo = fullSelector.join('');
  if (pseudo.length) {
    finalSelector.push(pseudo);
  }
  return finalSelector;
};

const processSelector = selector => {
  const value = stripSpaces(selector.value);

  // Things this needs to cope with:
  //   a
  //   a:hover
  //   a:hover, a:focus
  //   a::-webkit-wtfery
  const allSelectors = [];
  let currentSelector = [];
  value.forEach(v => {
    if (v.value === ',') {
      if (currentSelector.length > 0) {
        allSelectors.push(currentSelector);
      }
      currentSelector = [];
    } else {
      currentSelector.push(process(v));
    }
  });
  allSelectors.push(currentSelector);

  return allSelectors.map(v => distillSelector(v));
};

export default processSelector;
