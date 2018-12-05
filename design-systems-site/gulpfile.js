const gulp = require('gulp');
const del = require('del');

// Project stuff
const paths = require('./gulp/config-paths');
const metalsmithTasks = require('./gulp/tasks-metalsmith');

function clean() {
  return del(paths.distFiles);
}


module.exports = {
  clean,
  build: metalsmithTasks.build,
  default: gulp.series(clean, metalsmithTasks.build),
}
