const writeFile = require('./lib/writeFile');
const mkdirp = require('./lib/mkdirp');
const createProjectList = require('./lib/createProjectList');
const getProjectDefinitions = require('./lib/getProjectDefinitions');
const demandStatusDataGenerator = require('./statusDataGenerators/generateDemandData');
const defectStatusDataGenerator = require('./statusDataGenerators/generateDefectData');
const effortStatusDataGenerator = require('./statusDataGenerators/generateEffortData');

const path = './dist/.testApi/v1/project/';
const projectDefinitionsPath = './testApi/projectDefinitions';

getProjectDefinitions(projectDefinitionsPath)
  .then(projectDefinitions => {
    const projects = [];
    projectDefinitions.forEach(projectDefinition => {
      /* eslint-disable global-require */
      const project = require(`../projectDefinitions/${projectDefinition}`);
      /* eslint-enable global-require */
      projects.push(project);
    });
    const paths = [];
    projects.forEach(project => {
      paths.push(`${path}${project.detail.name}/`);
      paths.push(`${path}${project.detail.name}/demand/summary/`);
      paths.push(`${path}${project.detail.name}/defect/summary/`);
      paths.push(`${path}${project.detail.name}/effort/summary/`);
    });

    const projectList = createProjectList(projects);

    const fileList = [];
    fileList.push({
      filePath: `${path}index.html`,
      data: JSON.stringify(projectList),
    });
    projects.forEach(project => {
      fileList.push({
        filePath: `${path}${project.detail.name}/index.html`,
        data: JSON.stringify(project.detail),
      });
      fileList.push({
        filePath: `${path}${project.detail.name}/demand/summary/index.html`,
        data: JSON.stringify(demandStatusDataGenerator(project.dataOptions.demand)),
      });
      fileList.push({
        filePath: `${path}${project.detail.name}/defect/summary/index.html`,
        data: JSON.stringify(defectStatusDataGenerator(project.dataOptions.defect)),
      });
      fileList.push({
        filePath: `${path}${project.detail.name}/effort/summary/index.html`,
        data: JSON.stringify(effortStatusDataGenerator(project.dataOptions.effort)),
      });
    });

    /* eslint-disable no-console */
    Promise.all(paths.map(mkdirp))
      .then(() => Promise.all(fileList.map(writeFile)))
      .catch(error => console.log(error));
    /* eslint-enable no-console */
  });
