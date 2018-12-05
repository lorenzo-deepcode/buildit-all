const demandVsProjected = require('../services/statusIndicators/demand/demandVsProjected');
const constants = require('../util/constants');
const { CommonProjectStatusResult } = require('../util/utils');
const moment = require('moment');
const Should = require('should');

describe('Rag Status Indicators - Demand Vs Projected', () => {
  const name = 'Demand vs Projected';

  describe('First Piece of S curve', () => {
    const week = 1;
    const expectedComplete = 5;
    
    it('returns red when under the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete - 1));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete - 1, expectedComplete, constants.STATUSERROR, constants.DEMANDSECTION));
    });

    it('returns amber when right on the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete, expectedComplete, constants.STATUSWARNING, constants.DEMANDSECTION));
    });
    
    it('returns green when above the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete + 1));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete + 1, expectedComplete, constants.STATUSOK, constants.DEMANDSECTION));
    });
  });

  describe('Second Piece of S curve', () => {
    const week = 6;
    const expectedComplete = 35;
    it('returns red when under the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete - 1));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete - 1, expectedComplete, constants.STATUSERROR, constants.DEMANDSECTION));
    });

    it('returns amber when right on the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete, expectedComplete, constants.STATUSWARNING, constants.DEMANDSECTION));
    });
    
    it('returns green when above the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete + 1));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete + 1, expectedComplete, constants.STATUSOK, constants.DEMANDSECTION));
    });
  });

  describe('Third Piece of S curve', () => {
    const week = 14;
    const expectedComplete = 110;
    it('returns red when under the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete - 1));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete - 1, expectedComplete, constants.STATUSERROR, constants.DEMANDSECTION));
    });

    it('returns amber when right on the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete, expectedComplete, constants.STATUSWARNING, constants.DEMANDSECTION));
    });
    
    it('returns green when above the curve', () => {
      const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week), getDemandSpecificDoneCountOf(expectedComplete + 1));
      Should(result).match(CommonProjectStatusResult(name, expectedComplete + 1, expectedComplete, constants.STATUSOK, constants.DEMANDSECTION));
    });
  });

  describe('No ramp up (0 start iterations)', () => {

    describe('First piece of S curve', () => {
      const week = 2;
      const expectedComplete = 20;
      it('returns red when under the curve', () => {
          const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week, 0), getDemandSpecificDoneCountOf(expectedComplete - 1));
          Should(result).match(CommonProjectStatusResult(name, expectedComplete - 1, expectedComplete, constants.STATUSERROR, constants.DEMANDSECTION));
      });

      it('returns amber when right on the curve', () => {
        const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week, 0), getDemandSpecificDoneCountOf(expectedComplete));
        Should(result).match(CommonProjectStatusResult(name, expectedComplete, expectedComplete, constants.STATUSWARNING, constants.DEMANDSECTION));
      });
      
      it('returns green when above the curve', () => {
        const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week, 0), getDemandSpecificDoneCountOf(expectedComplete + 1));
        Should(result).match(CommonProjectStatusResult(name, expectedComplete + 1, expectedComplete, constants.STATUSOK, constants.DEMANDSECTION));
      });
    });

    describe('Second piece of S curve', () => {
      const week = 11;
      const expectedComplete = 110;
      it('returns red when under the curve', () => {
        const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week, 0), getDemandSpecificDoneCountOf(expectedComplete - 1));
        Should(result).match(CommonProjectStatusResult(name, expectedComplete - 1, expectedComplete, constants.STATUSERROR, constants.DEMANDSECTION));
      });

      it('returns amber when right on the curve', () => {
        const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week, 0), getDemandSpecificDoneCountOf(expectedComplete));
        Should(result).match(CommonProjectStatusResult(name, expectedComplete, expectedComplete, constants.STATUSWARNING, constants.DEMANDSECTION));
      });
      
      it('returns green when above the curve', () => {
        const result = demandVsProjected.evaluate(createProjectStartingWeeksAgo(week, 0), getDemandSpecificDoneCountOf(expectedComplete + 1));
        Should(result).match(CommonProjectStatusResult(name, expectedComplete + 1, expectedComplete, constants.STATUSOK, constants.DEMANDSECTION));
      });
    });
  });
});

function getDemandSpecificDoneCountOf(desiredDoneCount) {
  return [
    {
      projectDate: moment().utc().format(constants.DBDATEFORMAT), 
      status: {
        Done: desiredDoneCount,
      },
    },
    {
     projectDate: moment().utc().format(constants.DBDATEFORMAT), 
      status: {
        Done: desiredDoneCount - 1,
      }, 
    }
  ]; 
}

function createProjectStartingWeeksAgo(numberOfWeeksAgo, startIterations = 5) {
  return {
    projection: {
      backlogSize: 100,
      darkMatterPercentage: 20,
      endIterations: 3,
      endVelocity: 5,
      iterationLength: 1,
      startDate: moment().utc().subtract(numberOfWeeksAgo, 'weeks').format(constants.DBDATEFORMAT),
      startIterations,
      startVelocity: 5,
      targetVelocity: 10,
    },
  };
}