import config from 'helpers/config';
import { fetch, put, post, erase } from './xhr';

const projects = () => fetch(`${config.apiBaseUrl}v1/project/`);

const project = name => fetch(`${config.apiBaseUrl}v1/project/${name}`);
const projectDemandSummary = name => fetch(`${config.apiBaseUrl}v1/project/${name}/demand/summary`);
const projectDefectSummary = name => fetch(`${config.apiBaseUrl}v1/project/${name}/defect/summary`);
const projectEffortSummary = name => fetch(`${config.apiBaseUrl}v1/project/${name}/effort/summary`);
const projectRagStatusSummary = name =>
  fetch(`${config.apiBaseUrl}v1/project/${name}/status`);
const projectEventHistory = name => fetch(`${config.apiBaseUrl}v1/project/${name}/event`);

const starterProjects = () => fetch(
  `${config.starterProjectsBaseApiUrl}v1/project?status=available`
);

const saveProjection = (projection, name) => put(
  `${config.apiBaseUrl}v1/project/${name}/projection`,
  projection
);

const updateProject = (projectToUpdate) => put(
  `${config.apiBaseUrl}v1/project/${projectToUpdate.name}`,
  projectToUpdate
);

const saveProject = (projectToSave) => post(
  `${config.apiBaseUrl}v1/project/${projectToSave.name}`,
  projectToSave
);

const validateProject = (projectToValidate) => fetch(
  `${config.apiBaseUrl}v1/validateProject/`,
  projectToValidate
);

// TODO: uuuuuuuuuuuuuuuuuuuuuuuuuuuuuugh
const loginRequest = user => {
  if (process.env.NODE_ENV === 'development' || config.noauth) {
    return new Promise((resolve) => {
      resolve({
        user: {
          id: user.email,
          name: user.email,
        },
      });
    });
  }
  return post(`${config.loginUrl}`, user);
};
// const loginRequest = (user) => post(`${config.loginUrl}`, user);

const deleteProject = (projectToDelete) => erase(
  `${config.apiBaseUrl}v1/project/${projectToDelete.name}`
);

export default {
  projects,
  project,
  projectDemandSummary,
  projectDefectSummary,
  projectEffortSummary,
  projectRagStatusSummary,
  starterProjects,
  saveProjection,
  updateProject,
  saveProject,
  loginRequest,
  deleteProject,
  projectEventHistory,
  validateProject,
};
