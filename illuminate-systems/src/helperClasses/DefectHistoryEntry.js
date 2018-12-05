class DefectHistoryEntry {
  constructor (severity, status, startDate) {
    this.severity = severity;
    this.startDate = startDate;
    this.statusValue = status;
    this.changeDate = null;
  }
}

module.exports = DefectHistoryEntry;
