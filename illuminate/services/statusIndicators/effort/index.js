module.exports = {
  getStatuses(/* project, projectPath */) {
    const statusIndicators = [];
    return Promise.all(statusIndicators).then(statuses => {
      return statuses.filter(status => status);
    });
  },
};