const gulp = require('gulp');
const gulpsmith = require('gulpsmith');
const frontMatter = require("gulp-front-matter");

// Metalsmit plug-ins
const collections = require("metalsmith-collections");
const markdown = require("metalsmith-markdown");
const drafts = require("metalsmith-drafts");
const layouts = require("metalsmith-layouts");
const permalinks = require("metalsmith-permalinks");
const relativeLinks = require('metalsmith-relative-links');
const debug = require("metalsmith-debug");

// Project stuff
const paths = require('./config-paths');
const glossary = require('./metalsmith-glossary');

const glossaryTermFilesPattern = ['glossary/**/*.md', '!glossary/**/index.md'];


function build() {

  return gulp.src(paths.srcContentFiles)
    .pipe(
      frontMatter({
        property: "frontMatter"
      })
    )
    .on("data", function(file) {
      Object.assign(file, file.frontMatter);
      delete file.frontMatter;
    })
    .pipe(
      gulpsmith()
        .use(collections({
          glossary: {
            pattern: glossaryTermFilesPattern,
            sortBy: 'title',
            refer: false
          }
        }))
        .use(glossary({
          pattern: glossaryTermFilesPattern
        }))
        .use(drafts())
        .use(markdown())
        .use(permalinks())
        .use(relativeLinks())
        .use(layouts({
          directory: paths.srcTemplatesDir,
          engineOptions: {
            // Need this so that Nunjucks can find template
            // partials in sub-folders:
            path: paths.srcTemplatesDir,
          }
        }))
        .use(debug())
    )
    .pipe(gulp.dest(paths.distDir));
}

module.exports = {
  build
};
