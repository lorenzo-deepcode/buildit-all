import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';
import ProjectList from 'components/3-organisms/ProjectList';
import NewProjectList from 'components/3-organisms/NewProjectList';
import Project from 'components/3-organisms/Project';
import EditProject from 'components/3-organisms/EditProject';
import Projection from 'components/3-organisms/Projection';
import Status from 'components/3-organisms/Status';

module.exports = (
  <Route path="/" component={App}>
    <IndexRoute component={ProjectList} />
    <Route path="/new" component={NewProjectList} />
    <Route path="/:projectId" component={Project} />
    <Route path="/:projectId/edit" component={EditProject} />
    <Route path="/:projectId/projection" component={Projection} />
    <Route path="/:projectId/status" component={Status} />
  </Route>
);
