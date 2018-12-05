const trimTextInput = require('./trimTextInput');

export const trimFormInputs = project => {
  const result = project;

  Object.keys(project).forEach(key => {
    if (typeof(result[key]) === 'string') {
      result[key] = trimTextInput(result[key]);
    }
  });

  if (project.demand) {
    Object.keys(project.demand).forEach(key => {
      if (typeof(result.demand[key]) === 'string') {
        result.demand[key] = trimTextInput(result.demand[key]);
      }
    });
  }

  if (project.defect) {
    Object.keys(project.defect).forEach(key => {
      if (typeof(result.defect[key]) === 'string') {
        result.defect[key] = trimTextInput(result.defect[key]);
      }
    });
  }

  if (project.effort) {
    Object.keys(project.effort).forEach(key => {
      if (typeof(result.effort[key]) === 'string') {
        result.effort[key] = trimTextInput(result.effort[key]);
      }
    });
  }

  return result;
};
