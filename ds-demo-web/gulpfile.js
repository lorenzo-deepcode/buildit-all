const path = require('path');
const gulp = require('gulp');
const clean = require('gulp-clean');
const connect = require('gulp-connect');
const less = require('gulp-less');
const watch = require('gulp-watch');
const open = require('gulp-open');
const sourcemaps = require('gulp-sourcemaps');
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const merge = require('merge-stream');

const src = 'src';
const target = 'dist';

// Web server
gulp.task('serve', () => {
  connect.server({
    root: target,
    port: 9003,
    livereload: true
  })
  gulp.src('').pipe(open({uri: 'http://localhost:9003'}));
});

// File watcher
gulp.task('watch', () => {
  gulp.watch([
    `${src}/**`,
    `!${src}/css/*`,
    `!${src}/**/*.html`,
    `!${src}/**/*.hbs`
  ], { ignoreInitial: false }, ['copy-files']);
  gulp.watch([`${src}/**/*.html`], { ignoreInitial: false }, ['html']);
  gulp.watch([`${src}/css/**/*`], { ignoreInitial: false }, ['css']);
  gulp.watch([`${src}/**/*.hbs`], { ignoreInitial: false }, ['templates']);
  gulp.watch(['node_modules/@buildit/**/*'], { ignoreInitial: false }, ['css']);
});

// Clean the output directory
gulp.task('clean', () => {
  return gulp.src(target, { read: false })
    .pipe(clean());
});

// Copy all assets except our HTML and CSS
gulp.task('copy-files', () => {
  return gulp.src([
      `${src}/**`,
      './node_modules/handlebars/dist/handlebars.runtime.js',
      `!${src}/css/*`,
      `!${src}/**/*.html`,
      `!${src}/**/*.hbs`
    ])
    .pipe(gulp.dest(target))
    .pipe(connect.reload());
});

// Copy HTML
gulp.task('html', () => {
  return gulp.src([`${src}/**/*.html`])
    .pipe(gulp.dest(target))
    .pipe(connect.reload());
});

// Build the CSS
gulp.task('css', () => {
  return gulp.src([`${src}/css/*`])
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [
        path.join(__dirname, '.'),
        path.join(__dirname, `${src}/css`),
        path.join(__dirname, 'node_modules') ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${target}/css`))
    .pipe(connect.reload());
});

gulp.task('templates', function() {
  let partials = gulp.src([`${src}/components/*.hbs`])
    .pipe(handlebars())
    .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          return JSON.stringify(path.basename(fileName, '.js'));
        }
      }
    }));

  let templates = gulp.src(`${src}/main.hbs`)
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MySite.templates',
      noRedeclare: true // Avoid duplicate declarations
    }));

  // Output both the partials and the templates as build/js/templates.js
  return merge(partials, templates)
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(`${target}`))
    .pipe(connect.reload());
});

gulp.task('build', ['copy-files', 'html', 'css', 'templates']);
gulp.task('default', ['build', 'serve', 'watch']);
