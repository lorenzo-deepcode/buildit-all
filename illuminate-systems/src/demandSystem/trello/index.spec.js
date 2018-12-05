const Config = require('config');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');

const Should = require('should');
const Sinon = require('sinon');
const R = require('ramda');
const CO = require('co');

const trello = require('./');
const Rest = require('../../restler-as-promise');
const helperClasses = require('../../helperClasses');
const localConstants = require('../../constants');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const RAWTRELLOSTORY = [
  {
		id: '5988df737343533636ad9b06',
		labels: [],
		dateLastActivity: '2017-08-08T17:16:42.448Z',
		shortUrl: 'https://trello.com/c/czfbvP32',
		actions: [
			{
				id: '589e295d220e05ef1547a6dc',
				idMemberCreator: '5852b9a651809fa23f007abe',
				data: {
					listAfter: {
						name: 'Done',
						id: '586b9ac3d34581cba15ee3ee'
					},
					listBefore: {
						name: 'Ready for Demo',
						id: '5874fa68a07dd0940e7fa8f1'
					},
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					card: {
						shortLink: 'czfbvP32',
						idShort: 28,
						name: 'Save/Discard Twiglet (In Edit Mode) #L',
						id: '586d0ac183cd6e72a0216f25',
						idList: '586b9ac3d34581cba15ee3ee'
					},
					old: {
						idList: '5874fa68a07dd0940e7fa8f1'
					}
				},
				type: 'updateCard',
				date: '2017-02-10T20:58:05.814Z',
				memberCreator: {
					id: '5852b9a651809fa23f007abe',
					avatarHash: '7c44d73c5dcc0cf9471193967524dde1',
					fullName: 'Ben Hernandez',
					initials: 'BH',
					username: 'benhernandez8'
				}
			},
			{
				id: '5898c89469e719308a9e7be9',
				idMemberCreator: '5852bd92b18f2d3a1353b4b0',
				data: {
					listAfter: {
						name: 'Ready for Demo',
						id: '5874fa68a07dd0940e7fa8f1'
					},
					listBefore: {
						name: 'In Progress',
						id: '5852c5029da1150d4f74a1c4'
					},
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					card: {
						shortLink: 'czfbvP32',
						idShort: 28,
						name: 'Save/Discard Twiglet (In Edit Mode) #L',
						id: '586d0ac183cd6e72a0216f25',
						idList: '5874fa68a07dd0940e7fa8f1'
					},
					old: {
						idList: '5852c5029da1150d4f74a1c4'
					}
				},
				type: 'updateCard',
				date: '2017-02-06T19:03:48.647Z',
				memberCreator: {
					id: '5852bd92b18f2d3a1353b4b0',
					avatarHash: '5ec2cb4ae4096e79ac2e38d5f82f092a',
					fullName: 'Elizabeth Szoke',
					initials: 'ES',
					username: 'elizabethszoke1'
				}
			},
			{
				id: '5894e8d83d4fcfa5209e7101',
				idMemberCreator: '5852b9a651809fa23f007abe',
				data: {
					listAfter: {
						name: 'In Progress',
						id: '5852c5029da1150d4f74a1c4'
					},
					listBefore: {
						name: 'Ready for Demo',
						id: '5874fa68a07dd0940e7fa8f1'
					},
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					card: {
						shortLink: 'czfbvP32',
						idShort: 28,
						name: 'Save/Discard Twiglet (In Edit Mode) #L',
						id: '586d0ac183cd6e72a0216f25',
						idList: '5852c5029da1150d4f74a1c4'
					},
					old: {
						idList: '5874fa68a07dd0940e7fa8f1'
					}
				},
				type: 'updateCard',
				date: '2017-02-03T20:32:24.579Z',
				memberCreator: {
					id: '5852b9a651809fa23f007abe',
					avatarHash: '7c44d73c5dcc0cf9471193967524dde1',
					fullName: 'Ben Hernandez',
					initials: 'BH',
					username: 'benhernandez8'
				}
			},
			{
				id: '5890d98c1b286e9eef1d3b86',
				idMemberCreator: '5852b9a651809fa23f007abe',
				data: {
					listAfter: {
						name: 'Ready for Demo',
						id: '5874fa68a07dd0940e7fa8f1'
					},
					listBefore: {
						name: 'Selected For Development',
						id: '5878fddb27cb20096dfc4926'
					},
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					card: {
						shortLink: 'czfbvP32',
						idShort: 28,
						name: 'Save/Discard Twiglet (In Edit Mode) #L',
						id: '586d0ac183cd6e72a0216f25',
						idList: '5874fa68a07dd0940e7fa8f1'
					},
					old: {
						idList: '5878fddb27cb20096dfc4926'
					}
				},
				type: 'updateCard',
				date: '2017-01-31T18:38:04.839Z',
				memberCreator: {
					id: '5852b9a651809fa23f007abe',
					avatarHash: '7c44d73c5dcc0cf9471193967524dde1',
					fullName: 'Ben Hernandez',
					initials: 'BH',
					username: 'benhernandez8'
				}
			},
			{
				id: '588bb3c3c5e2706471e527c8',
				idMemberCreator: '5852b9a651809fa23f007abe',
				data: {
					listAfter: {
						name: 'Selected For Development',
						id: '5878fddb27cb20096dfc4926'
					},
					listBefore: {
						name: 'Ready for Demo',
						id: '5874fa68a07dd0940e7fa8f1'
					},
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					card: {
						shortLink: 'czfbvP32',
						idShort: 28,
						name: 'Save/Discard Twiglet (In Edit Mode) #L',
						id: '586d0ac183cd6e72a0216f25',
						idList: '5878fddb27cb20096dfc4926'
					},
					old: {
						idList: '5874fa68a07dd0940e7fa8f1'
					}
				},
				type: 'updateCard',
				date: '2017-01-27T20:55:31.731Z',
				memberCreator: {
					id: '5852b9a651809fa23f007abe',
					avatarHash: '7c44d73c5dcc0cf9471193967524dde1',
					fullName: 'Ben Hernandez',
					initials: 'BH',
					username: 'benhernandez8'
				}
			},
			{
				id: '58890c647e72b2d8d4b135a5',
				idMemberCreator: '5852bd92b18f2d3a1353b4b0',
				data: {
					listAfter: {
						name: 'Ready for Demo',
						id: '5874fa68a07dd0940e7fa8f1'
					},
					listBefore: {
						name: 'In Progress',
						id: '5852c5029da1150d4f74a1c4'
					},
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					card: {
						shortLink: 'czfbvP32',
						idShort: 28,
						name: 'Save/Discard Twiglet (In Edit Mode) #L',
						id: '586d0ac183cd6e72a0216f25',
						idList: '5874fa68a07dd0940e7fa8f1'
					},
					old: {
						idList: '5852c5029da1150d4f74a1c4'
					}
				},
				type: 'updateCard',
				date: '2017-01-25T20:36:52.130Z',
				memberCreator: {
					id: '5852bd92b18f2d3a1353b4b0',
					avatarHash: '5ec2cb4ae4096e79ac2e38d5f82f092a',
					fullName: 'Elizabeth Szoke',
					initials: 'ES',
					username: 'elizabethszoke1'
				}
			},
			{
				id: '5887bdef5ba112ad24ff0f9e',
				idMemberCreator: '5852bd92b18f2d3a1353b4b0',
				data: {
					listAfter: {
						name: 'In Progress',
						id: '5852c5029da1150d4f74a1c4'
					},
					listBefore: {
						name: 'Backlog',
						id: '5852c4dacd99a6b33721358e'
					},
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					card: {
						shortLink: 'czfbvP32',
						idShort: 28,
						name: 'Save/Discard Twiglet (In Edit Mode) #L',
						id: '586d0ac183cd6e72a0216f25',
						idList: '5852c5029da1150d4f74a1c4'
					},
					old: {
						idList: '5852c4dacd99a6b33721358e'
					}
				},
				type: 'updateCard',
				date: '2017-01-24T20:49:51.607Z',
				memberCreator: {
					id: '5852bd92b18f2d3a1353b4b0',
					avatarHash: '5ec2cb4ae4096e79ac2e38d5f82f092a',
					fullName: 'Elizabeth Szoke',
					initials: 'ES',
					username: 'elizabethszoke1'
				}
			},
		]
  },
  {
		id: '5988df9da10fae88aa36ed65',
		labels: [],
		dateLastActivity: '2017-08-08T17:38:22.877Z',
		shortUrl: 'https://trello.com/c/bpdKeknD',
		actions: []
  },
  {
    id: '5852c76ae920023062777a48',
    labels: [],
    dateLastActivity: '2017-08-16T16:53:49.832Z',
    shortUrl: 'https://trello.com/c/ZLITfYS3',
    actions: [
      {
				id: '5988df737343533636ad9b07',
				idMemberCreator: '5850705288bd8136703f2c3b',
				data: {
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					list: {
						name: 'Backlog',
						id: '5852c4dacd99a6b33721358e'
					},
					card: {
						shortLink: 'bpdKeknD',
						idShort: 399,
						name: 'Automate CloudWatch logging for Twig & TwigAPI ELBs (can\'t do via convox)',
						id: '5988df737343533636ad9b06'
					}
				},
				type: 'createCard',
				date: '2017-08-07T21:45:23.437Z',
				memberCreator: {
					id: '5850705288bd8136703f2c3b',
					avatarHash: 'c88a0753dc245e3e55c4a4e8a39721ea',
					fullName: 'Andrew Ochsner',
					initials: 'AO',
					username: 'andrewochsner1'
				}
			}
    ]
  },
  {
		id: '5931c9a4df99d4ff0e1b1e29',
		labels: [],
		dateLastActivity: '2017-06-01T17:16:42.448Z',
		shortUrl: 'https://trello.com/c/czfbvP32',
		actions: [
			{
				id: '5988df9da10fae88aa36ed66',
				idMemberCreator: '5850705288bd8136703f2c3b',
				data: {
					board: {
						shortLink: 'gvh3zIcI',
						name: 'Twig',
						id: '5852b80f77946e47caa83648'
					},
					list: {
						name: 'Backlog',
						id: '5852c4dacd99a6b33721358e'
					},
					card: {
						shortLink: '7cHc7UXU',
						idShort: 400,
						name: 'Add google analytics (or some other usage analytics) to twig front end',
						id: '5988df9da10fae88aa36ed65'
					}
				},
				type: 'createCard',
				date: '2017-08-07T21:46:05.840Z',
				memberCreator: {
					id: '5850705288bd8136703f2c3b',
					avatarHash: 'c88a0753dc245e3e55c4a4e8a39721ea',
					fullName: 'Andrew Ochsner',
					initials: 'AO',
					username: 'andrewochsner1'
				}
			}
		]
  }
];

const DEMANDINFO = {
  project: 'a project',
  url: 'http://some.url',
  authPolicy: 'key:token',
  userData: 'token:secretToken',
};

const EXPECTEDCOMMON = [
  { 
		_id: '5988df737343533636ad9b06',
    uri: 'https://trello.com/c/czfbvP32',
    history: [
      { statusValue: 'Backlog', startDate: '2017-08-07T21:45:23.000Z', changeDate: '2017-01-24T20:49:51.607Z' },
      { statusValue: 'In Progress', startDate: '2017-01-24T20:49:51.607Z', changeDate: '2017-01-25T20:36:52.130Z' },
      { statusValue: 'Ready for Demo', startDate: '2017-01-25T20:36:52.130Z', changeDate: '2017-01-27T20:55:31.731Z' },
      { statusValue: 'Selected For Development', startDate: '2017-01-27T20:55:31.731Z', changeDate: '2017-01-31T18:38:04.839Z' },
      { statusValue: 'Ready for Demo', startDate: '2017-01-31T18:38:04.839Z', changeDate: '2017-02-03T20:32:24.579Z' },
      { statusValue: 'In Progress', startDate: '2017-02-03T20:32:24.579Z', changeDate: '2017-02-06T19:03:48.647Z' },
      { statusValue: 'Ready for Demo', startDate: '2017-02-06T19:03:48.647Z', changeDate: '2017-02-10T20:58:05.814Z' },
      { statusValue: 'Done', startDate: '2017-02-10T20:58:05.814Z', changeDate: null },
    ]
	}, 
	{ 
		_id: '5852c76ae920023062777a48',
		uri: 'https://trello.com/c/ZLITfYS3',
		history: [
			{ statusValue: 'Backlog', startDate: '2016-12-15T16:40:10.000Z', changeDate: null },
		]
	}
];

const processingInfo = {
  dbUrl: '',
  rawLocation: '',
  storageFunction(_, __, enhancedStories) {
    return Promise.resolve(enhancedStories);
  }
}


describe('Demand -> Trello ->', () => {
  let sandbox = Sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });
  
  describe('loadRawData', () => {
    let storageFunction = sandbox.stub();
    const processingInfo = {
      dbUrl: 'a db url',
      rawLocation: 'a raw location',
    }

    beforeEach(() => {
      storageFunction = sandbox.stub();
    });

    it('stores the data if there is at least one story', () => {
      sandbox.stub(Rest, 'get').resolves({ data: RAWTRELLOSTORY });
      return trello.loadRawData(DEMANDINFO, R.merge(processingInfo, { storageFunction }), '2017-08-09', null)
      .then(() => {
        Should(storageFunction.callCount).match(1);
      });
    });

    it('stores nothing if there are no stories', () => {
      sandbox.stub(Rest, 'get').resolves({ data: [] });
      return trello.loadRawData(DEMANDINFO, R.merge(processingInfo, { storageFunction }), '2017-08-09', null)
      .then(() => {
        Should(storageFunction.callCount).match(0);
      });
    });
  });

  describe('loadRawData correctly uses _loadDemand', () => {
    const idKeys = {
      storyWithMultipleActions: '5988df737343533636ad9b06',
      storyWithoutActions: '5988df9da10fae88aa36ed65',
      nonStoryWithActions: '5852c76ae920023062777a48',
      earlierStoryWithActions: '5931c9a4df99d4ff0e1b1e29',
    }

    beforeEach(() => {
      sandbox.stub(Rest, 'get').resolves({ data: RAWTRELLOSTORY });
    });

    it('filters out cards that do not have any actions', () => {
      return trello.loadRawData(DEMANDINFO, processingInfo, '2000-01-01', null)
      .then((data) => {
        Should(data.every(d => d.id !== idKeys.storyWithoutActions)).be.true();
      });
    });

    it('filters out cards that happen before the sinceTime variable', () => {
      return trello.loadRawData(DEMANDINFO, processingInfo, '2017-07-01', null)
      .then((data) => {
        Should(data.every(d => d.id !== idKeys.earlierStoryWithActions)).be.true();
      });
    });

    it('adds the _id and creationDate to all of the stories', () => {
      return trello.loadRawData(DEMANDINFO, processingInfo, '2017-07-01', null)
      .then((data) => {
        Should(data.every(d => d._id && d.creationDate)).be.true();
      });
    });

    it('adds the correct id to stories', () => {
      return trello.loadRawData(DEMANDINFO, processingInfo, '2017-07-01', null)
      .then((data) => {
        Should(data[0]._id).equal(idKeys.storyWithMultipleActions);
      });
    });

    it('adds the correct creationDate to stories', () => {
      return trello.loadRawData(DEMANDINFO, processingInfo, '2017-07-01', null)
      .then((data) => {
        Should(data[0].creationDate).equal('2017-08-07T21:45:23.000Z');
      });
		});
		
		it('handles http errors gracefully', () => {
			function errorBody(statusCode, message) {
				return {
					message,
					statusCode,
				}
			}
			Rest.get.restore();
			sandbox.stub(Rest, 'get').rejects({ data: RAWTRELLOSTORY, response: { statusCode: HttpStatus.NOT_FOUND } });
			return trello.loadRawData(DEMANDINFO, processingInfo, '2017-07-01', errorBody)
			.catch(error => {
				Should(error.statusCode).equal(HttpStatus.NOT_FOUND);
			})
		});

		it('handles errors gracefully', () => {
			function errorBody(statusCode, message) {
				return {
					message,
					statusCode,
				}
			}
			Rest.get.restore();
			sandbox.stub(Rest, 'get').rejects(new Error('random error'));
			return trello.loadRawData(DEMANDINFO, processingInfo, '2017-07-01', errorBody)
			.catch(error => {
				Should(error.message).equal('random error');
			});
		});
  });

  describe('transformRawToCommon', () => {

    let rawData = [];

    before(() => {
      sandbox.stub(Rest, 'get').resolves({ data: RAWTRELLOSTORY, response: { statusCode: HttpStatus.OK } });

      return trello.loadRawData(DEMANDINFO, processingInfo, '2017-07-01', null)
      .then(raw => rawData = raw);
    });

    it('transforms the raw data to common data', () => {
			const commonData = trello.transformRawToCommon(rawData);
      return Should(commonData).deepEqual(convertDemandIntoCommonDemandEntry(EXPECTEDCOMMON));
    });
	});
	
	describe('testDemand()', () => {
		const sandbox = Sinon.sandbox.create();
	
		const aProject = {
			name: 'Test Project',
			demand: {
				flow: [{ name: 'Backlog' }],
				source: 'Trello',
				url: 'http://some.url',
				project: 'Some Trello Project',
				authPolicy: 'Basic',
				userData: 'some secret key',
			}
		};
	
		afterEach(() => {
			sandbox.restore();
		})
	
		it('returns an error when the url is invalid.', () => {
			return CO(function* () {
				const project = R.mergeDeepRight(aProject, { demand: { url: 'invalid url' } });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when the trello [project] is an empty string', () => {
			return CO(function* () {
				const project = R.mergeDeepRight(aProject, { demand: { project: '' } });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when the trello [project] is null', () => {
			return CO(function* () {
				const demand = R.omit(['project'], aProject.demand);
				const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when [authPolicy] is an empty string', () => {
			return CO(function* () {
				const project = R.mergeDeepRight(aProject, { demand: { authPolicy: '' } });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when [authPolicy] is null', () => {
			return CO(function* () {
				const demand = R.omit(['authPolicy'], aProject.demand);
				const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when [userData] is an empty string', () => {
			return CO(function* () {
				const project = R.mergeDeepRight(aProject, { demand: { userData: '' } });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when [userData] is null', () => {
			return CO(function* () {
				const demand = R.omit(['userData'], aProject.demand);
				const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when [flow] is an empty array', () => {
			return CO(function* () {
				const project = R.mergeDeepRight(aProject, { demand: { flow: '' } });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns an error when [flow] is null', () => {
			return CO(function* () {
				const demand = R.omit(['flow'], aProject.demand);
				const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
				const result = yield trello.testDemand(project, localConstants);
				Should(result.status).equal(localConstants.STATUSERROR);
			});
		});
	
		it('returns green when the request to trello is successful', () => {
			return CO(function* () {
				sandbox.stub(Rest, 'get').resolves();
				const result = yield trello.testDemand(aProject, localConstants);
				Should(result.status).equal(localConstants.STATUSOK);
			});
    });
    
    it('returns red when the request to Jira is successful', () => {
      return CO(function* () {
        sandbox.stub(Rest, 'get').rejects({ });
        const result = yield trello.testDemand(aProject, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
	});
});

function convertHistoryToDemandHistoryEntry(historyArray) {
	return historyArray.map(history => {
		const returner = new helperClasses.DemandHistoryEntry(history.statusValue, history.startDate);
		if (history.changeDate) {
			returner.changeDate = history.changeDate;
		}
		return returner;
	})
}

function convertDemandIntoCommonDemandEntry(entries) {
	return entries.map(entry => {
		const commonDemandEntry = new helperClasses.CommonDemandEntry(entry._id);
		commonDemandEntry.uri = entry.uri;
		commonDemandEntry.history = convertHistoryToDemandHistoryEntry(entry.history);
		return commonDemandEntry;
	});
}