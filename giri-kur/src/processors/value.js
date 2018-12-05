import process from './index';

const stripLeadingSpaces = collection => {
  let somethingFound = false;
  const finalCollection = [];
  collection.forEach(c => {
    let push = false;
    if (c.type === 'space') {
      push = somethingFound;
    } else {
      somethingFound = true;
      push = true;
    }
    if (push) {
      finalCollection.push(c);
    }
  });
  return finalCollection;
};
const stripTrailingSpaces = collection => {
  collection.reverse();
  const finalCollection = stripLeadingSpaces(collection);
  finalCollection.reverse();
  return finalCollection;
};
const trim = collection => {
  let workingCollection = stripLeadingSpaces(collection);
  workingCollection = stripTrailingSpaces(workingCollection);
  return workingCollection;
};

const processValue = value => {
  const values = trim(value.value);
  return values.reduce((t, v) => (t + process(v)), '');
};

export default processValue;
