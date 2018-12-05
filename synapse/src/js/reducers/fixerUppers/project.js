import validateProject from './validators/validateProject';
const schema = require('./schemas/project.json');
import normalizeProject from './normalizers/normalizeProject';

const logErrors = (errors, projectName) => {
  if (errors.length > 0) {
    /* eslint-disable no-console */
    console.log(
    `The data as received from the API for the project named ${projectName}
    does not match the project schema.
    The validation errors are:`);
    errors.map(error => console.log(`project${error.dataPath} ${error.message}`));
    /* eslint-enable no-console */
  }
};

const fixerUpper = project => {
  const validationErrors = validateProject(project, schema);
  logErrors(validationErrors, project.name);
  return normalizeProject(project, validationErrors);
};

export default fixerUpper;
