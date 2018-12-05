module.exports = {
  dataOptions: {
    demand: 'STANDARD',
    defect: 'STANDARD',
    effort: 'STANDARD',
  },
  detail: {
    name: 'Test-1',
    program: 'Basic Test Data',
    portfolio: 'Acceptance Test Data',
    description: 'A set of basic test data to be used to validate behavior of client systems.',
    startDate: '2016-07-01',
    endDate: '2016-12-01',
    demand: {
      source: 'Excel',
      url: '',
      project: 'TestData1',
      authPolicy: 'None',
      userData: '',
      flow: [{
        name: 'Backlog',
        groupWith: null,
      }, {
        name: 'Selected for Development',
        groupWith: null,
      }, {
        name: 'In Progress',
        groupWith: null,
      }, {
        name: 'Done',
        groupWith: null,
      }],
    },
    defect: {
      url: '',
      project: 'TestData1',
      authPolicy: 'None',
      userData: '',
      entryState: 'Open',
      exitState: 'Resolved',
      severity: [{
        name: 'Trivial',
        groupWith: null,
      }, {
        name: 'Minor',
        groupWith: null,
      }, {
        name: 'Major',
        groupWith: 1,
      }, {
        name: 'Critical',
        groupWith: 2,
      }],
    },
    effort: {
      url: '',
      project: 'TestData1',
      authPolicy: 'None',
      userData: '',
      role: [{
        name: 'PM',
        groupWith: 'BA',
      }, {
        name: 'BA',
        groupWith: 'PM',
      }, {
        name: 'SD',
        groupWith: null,
      }, {
        name: 'Build',
        groupWith: null,
      }, {
        name: 'Test',
        groupWith: null,
      }, {
        name: 'Release Mgmt',
        groupWith: null,
      }],
    },
    projection: {
      startDate: '2016-07-10',
      iterationLength: 2,
      backlogSize: 175,
      targetVelocity: 20,
      darkMatterPercentage: 10,
      startIterations: 3,
      startVelocity: 10,
      endIterations: 2,
      endVelocity: 10,
    },
  },
};
