class DemandHistoryEntry {
  constructor (status, startDate) {
    this.statusValue = status;
    this.startDate = startDate;
    this.changeDate = null;
  }
}

module.exports = DemandHistoryEntry;
  