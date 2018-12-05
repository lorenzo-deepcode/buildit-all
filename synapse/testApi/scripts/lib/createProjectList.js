module.exports = projects => projects.map(project => (
  {
    name: project.detail.name,
    program: project.detail.program,
    portfolio: project.detail.portfolio,
    description: project.detail.description,
  }
));
