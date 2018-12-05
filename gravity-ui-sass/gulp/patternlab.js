/******************************************************
 * EXPORTS PATTERN LAB TASKS
 *
 * Note that substantial chunks of this file were
 * originally copied from Pattern Lab's Node Gulp
 * Edition gulpfile:
 * https://github.com/pattern-lab/edition-node-gulp/blob/master/gulpfile.js
 *
******************************************************/

const gulp = require('gulp');
const sass = require('gulp-sass');
const eyeglass = require('eyeglass');
const rename = require("gulp-rename");
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const pkgPaths = require('./paths.js');

const taskNamePrefix = 'patternlab:';

//read all paths from our namespaced config file
const config = require('../patternlab-config.json');
const patternlab = require('@pattern-lab/core')(config);

function paths() {
  return config.paths;
}

/******************************************************
 * PRE-BUILD TASKS
 * Copies / creates any generated data or patterns that
 * are then processed by Pattern Lab in the usual way
******************************************************/

// Exported array of glob patterns that clean tasks can use to
// delete any files generated at build-time
const generatedFileGlobs = [
  path.join(__dirname, '..', 'dependencyGraph.json')
];

const generatedPatternsDir = pkgPaths.normalizePath(paths().source.patterns, '_generated');
generatedFileGlobs.push(path.join(generatedPatternsDir, '*'));
generatedFileGlobs.push('!' + path.join(generatedPatternsDir, 'README.md')); // Prevent README.md from being deleted

function preSvgSymbolsTask () {
  return gulp.src(pkgPaths.bldSvgSymbolsFilePath)
    .pipe(rename('symbols.mustache'))
    .pipe(gulp.dest(generatedPatternsDir));
};
preSvgSymbolsTask.displayName = taskNamePrefix + 'pre:symbols';
preSvgSymbolsTask.description = 'Copies Gravity\'s symbols.svg file to the patterns folder.';


const generatedSymbolInfoFilename = '00-svg-symbols.json';
const generatedSymbolInfoDir = pkgPaths.normalizePath(paths().source.patterns, '00-particles', '05-logos-and-icons');
generatedFileGlobs.push(path.join(generatedSymbolInfoDir, generatedSymbolInfoFilename));

function preSvgSymbolsInfoTask () {
  return gulp.src(pkgPaths.bldSvgSymbolsInfoFilePath)
    .pipe(rename(generatedSymbolInfoFilename))
    .pipe(gulp.dest(generatedSymbolInfoDir));
};
preSvgSymbolsInfoTask.displayName = taskNamePrefix + 'pre:symbols-info';
preSvgSymbolsInfoTask.description = 'Copies Gravity\'s symbols.json file to the patterns folder.';


const preBuildTask = gulp.parallel(preSvgSymbolsTask, preSvgSymbolsInfoTask);

/******************************************************
 * STYLEGUIDE CSS TASKS
******************************************************/

function plSassTask() {
  return gulp.src(pkgPaths.normalizePath(paths().source.root, 'sass', 'pattern-scaffolding.scss'))
    .pipe(sass(eyeglass(sass.sync().on('error', sass.logError))))
    .pipe(gulp.dest(pkgPaths.normalizePath(paths().public.css)))
};
plSassTask.displayName = taskNamePrefix + 'sass';
plSassTask.description = 'Compiles pattern library CSS files from source SASS.';


/******************************************************
 * CLI TASKS
******************************************************/

function plVersionTask (done) {
  patternlab.version();
  done();
};
plVersionTask.displayName = taskNamePrefix + 'version';
plVersionTask.description = 'eturn the version of patternlab-node you have installed';


function plHelpTask (done) {
  patternlab.help();
  done();
};
plHelpTask.displayName = taskNamePrefix + 'help';
plHelpTask.description = 'Get more information about patternlab-node, pattern lab in general, and where to report issues.';


function plPatternsOnlyTask (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
};
plPatternsOnlyTask.displayName = taskNamePrefix + 'patternsonly';
plPatternsOnlyTask.description = 'Compiles the patterns only, outputting to config.paths.public';


function plListStarterKitsTask (done) {
  patternlab.liststarterkits();
  done();
};
plListStarterKitsTask.displayName = taskNamePrefix + 'liststarterkits';
plListStarterKitsTask.description = 'Returns a url with the list of available starterkits hosted on the Pattern Lab organization Github account';


function plLoadStarterKitsTask (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
};
plLoadStarterKitsTask.displayName = taskNamePrefix + 'loadstarterkit';
plLoadStarterKitsTask.description = 'Load a starterkit into config.paths.source/*';


function plInstallPluginTask (done) {
  patternlab.installplugin(argv.plugin);
  done();
};
plInstallPluginTask.displayName = taskNamePrefix + 'installplugin';


/******************************************************
 * BUILD TASK
******************************************************/

function plBuildSgTask() {
  return patternlab.build({
    watch: argv.watch,
    cleanPublic: config.cleanPublic
  });
}
plBuildSgTask.displayName = taskNamePrefix + 'sg:build';
plBuildSgTask.description = 'Builds the styleguide';


const plBuildTask = gulp.series(
  gulp.parallel(plSassTask, preBuildTask),
  plBuildSgTask
);
plBuildTask.displayName = taskNamePrefix + 'build';
plBuildTask.description = 'Compiles the patterns and frontend, outputting to config.paths.public';


/******************************************************
 * WATCH TASKS
******************************************************/

function plWatchSassTask() {
  gulp.watch(
    pkgPaths.normalizePath(paths().source.root, 'sass', '**', '*.scss'),
    gulp.series(plSassTask, patternlab.server.refreshCSS)
  );
}
plWatchSassTask.displayName = taskNamePrefix + 'css:watch';
plWatchSassTask.description = 'Watches for changes to styleguide SASS and compiles to CSS.';


function plWatchSgTask() {
  return patternlab.build({
    watch: true,
    cleanPublic: config.cleanPublic
  });
}
plWatchSgTask.displayName = taskNamePrefix + 'sg:watch';
plWatchSgTask.description = 'Watches for changes to styleguide source files.';


const plWatchTask = gulp.series(
  gulp.parallel(plSassTask, preBuildTask),
  gulp.parallel(plWatchSassTask, plWatchSgTask)
);
plWatchTask.displayName = taskNamePrefix + 'watch';
plWatchTask.description = 'Builds the styleguide and starts watching styleguide source files.';


/******************************************************
 * SERVE TASK
******************************************************/

function plServeSgTask() {
  return patternlab.server.serve({
    watch: true,
    cleanPublic: config.cleanPublic
  });
}
plServeSgTask.displayName = taskNamePrefix + 'sg:serve';
plServeSgTask.description = 'Builds styleguide HTML only and launches Pattern Lab\'s built-in server.';


const plServeTask = gulp.series(
  gulp.parallel(plSassTask, preBuildTask),
  gulp.parallel(plWatchSassTask, plServeSgTask)
);
plServeTask.displayName = taskNamePrefix + 'serve';
plServeTask.description = 'Builds styleguide and launches Pattern Lab\'s built-in server.';



module.exports = {
  // Pre-build tasks
  preSvgSymbolsTask,
  preSvgSymbolsInfoTask,
  preBuildTask,

  // CLI
  plVersionTask,
  plHelpTask,
  plPatternsOnlyTask,
  plListStarterKitsTask,
  plLoadStarterKitsTask,
  plInstallPluginTask,

  // Build
  plBuildTask,

  // Watch tasks
  plWatchTask,

  // Serve
  plServeTask,

  // Generated file paths
  generatedFileGlobs,

  // Export Pattern Lab server reload functions, so
  // other tasks can trigger reloads
  plServerReload: () => patternlab.server.reload(),
  plServerRefreshCss: () => patternlab.server.refreshCSS(),
}
