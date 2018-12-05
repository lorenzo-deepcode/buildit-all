const gulp = require('gulp');
const less = require('gulp-less');
const decompress = require('gulp-decompress');
const download = require('gulp-download');
const rename = require('gulp-rename');
const filter = require('gulp-filter');
const clean = require('gulp-clean');

const brandai = require('./brandai.config').default.brandai;
const frontify = require('./brandai.config').default.frontify;

const targetDir = 'src/assets';
const brandaiDir = `${targetDir}/brandai`;
const frontifyDir = `${targetDir}/frontify`;

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
      .pipe(clean());
});

gulp.task('copy-styles', () => {
  return gulp.src(['./src/**/*.less'])
    .pipe(gulp.dest('dist'));
});

gulp.task('assets:brandai:styles', function(){
  return download(brandai.styles)
    .pipe(rename({
      basename: 'styles',
      extname: '.less'
    }))
    .pipe(gulp.dest(brandaiDir));
});

gulp.task('assets:brandai:logos', function(){
  return download(brandai.logos)
    .pipe(decompress())
    .pipe(gulp.dest(brandaiDir));
});

gulp.task('assets:frontify:devkit', function(){
  // Download & unzip devkit
  return download(frontify.devkit)
    .pipe(decompress())
    .pipe(rename(function(path){
      // Strip off top-level dir
      path.dirname = path.dirname.replace(/^.*?\//, '');
    }))
    .pipe(filter([
      'css/colors.less',
      'css/fonts.css',
      'fonts/*'
    ]))
    .pipe(gulp.dest(frontifyDir));
});

gulp.task('assets:frontify:logos', function(){
  return download(frontify.logo)
    .pipe(rename({
      basename: 'logo',
      extname: '.png'
    }))
    .pipe(gulp.dest(frontifyDir));
});

gulp.task('assets', ['assets:brandai:styles', 'assets:brandai:logos', 'assets:frontify:devkit', 'assets:frontify:logos']);

gulp.task('default', ['assets']);
