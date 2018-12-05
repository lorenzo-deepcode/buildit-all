module.exports = array => {
  const indexOfLastItem = array.length - 1;
  for (let i = 0; i < indexOfLastItem; ++i) {
    const current = array[i];
    const next = array[i + 1];
    if (current[0] > next[0]) {
      return false;
    }
  }
  return true;
};
