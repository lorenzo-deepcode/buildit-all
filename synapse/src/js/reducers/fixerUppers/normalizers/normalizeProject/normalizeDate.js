const normalizeDate = date => {
  if (date) {
    return date.split('T')[0];
  }
  return undefined;
};

export default normalizeDate;
