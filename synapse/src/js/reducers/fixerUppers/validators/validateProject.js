import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

const validateProject = (project, schema) => {
  const validate = ajv.compile(schema);
  validate(project);
  return validate.errors;
};

export default validateProject;
