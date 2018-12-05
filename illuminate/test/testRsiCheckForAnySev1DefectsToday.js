const checkForAnySev1DefectsToday = require('../services/statusIndicators/defect/checkForAnySev1DefectsToday');
const constants = require('../util/constants');
const { CommonProjectStatusResult } = require('../util/utils');
const moment = require('moment');
const Should = require('should');

const name = 'Sev 1 Defects Today';

const project = {
  name: 'testProject',
  defect: {
    severity: [
      { name: 'Trivial', groupWith: null },
      { name: 'Minor', groupWith: null },
      { name: 'Major', groupWith: 1 },
      { name: 'Critical', groupWith: 2 }
    ]
  }
}

describe('checkForAnySev1DefectsToday', () => {
  it('returns an OK status if there are no "Sev 1" defects today', () => {
    const result = checkForAnySev1DefectsToday.evaluate(project, defects(0));
    Should(result).match(CommonProjectStatusResult(name, 0, 0, constants.STATUSOK, constants.DEFECTSECTION));
  });

  it('returns a WARNING status if there is a single "Sev 1" defects today', () => {
    const result = checkForAnySev1DefectsToday.evaluate(project, defects(1));
    Should(result).match(CommonProjectStatusResult(name, 1, 0, constants.STATUSWARNING, constants.DEFECTSECTION));
  });

  it('returns a WARNING status if there is more than 1 "Sev 1" defects today', () => {
    const result = checkForAnySev1DefectsToday.evaluate(project, defects(1000));
    Should(result).match(CommonProjectStatusResult(name, 1000, 0, constants.STATUSWARNING, constants.DEFECTSECTION));
  });
});

function defects(sev1Count) {
  const returner = [
    {
      projectDate: moment().utc().subtract(1, 'days').format(constants.DBDATEFORMAT),
      severity: {
        Critical: getRandomInt(3, 10),
        Major: getRandomInt(1, 2),
        Minor: getRandomInt(1, 5),
        Trival: getRandomInt(3, 5),
      }
    },
    {
      projectDate: moment().utc().format(constants.DBDATEFORMAT),
      severity: {
        Major: getRandomInt(1, 2),
        Minor: getRandomInt(1, 5),
        Trival: getRandomInt(3, 5),
      }
    },
  ];
  if (sev1Count > 0) {
    returner[1].severity.Critical = sev1Count;
  }
  return returner;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

