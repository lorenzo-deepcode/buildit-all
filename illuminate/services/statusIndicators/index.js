const demandStatuses = require('./demand');
const defectStatuses = require('./defect');
const effortStatuses = require('./effort');

module.exports = {
  getStatuses(aProject, projectUrl) {
    const promises = [];
    promises.push(demandStatuses.getStatuses(aProject, projectUrl));
    promises.push(defectStatuses.getStatuses(aProject, projectUrl));
    promises.push(effortStatuses.getStatuses(aProject, projectUrl));
    return Promise.all(promises)
    .then(([demand, defect, effort]) => {
      return {
        demand,
        defect,
        effort,
      }
    })
  }
}