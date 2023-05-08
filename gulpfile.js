const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const mergeCSS = require('gulp-merge-css');
const autoprefixer = require('gulp-autoprefixer');
const fileinclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const htmlbeautify = require('gulp-html-beautify')
const argv = require('yargs').argv;
const rename = require('gulp-rename');
const svgSprite = require('gulp-svg-sprite');
const inject = require('gulp-inject');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
var postcssCriticalSplit = require('postcss-critical-split');
var isProduction = (argv.production === undefined) ? false : true;

// Function to get the content of the file into string
var transformCSSFile = function (filePath, file) { return '<style>\n' + file.contents.toString('utf8') + '\n</style>' };

// Config object for the inject task
var conf = {
    removeTags: true,
    transform : transformCSSFile
  }
  gulp.task('inject-critical', function(){
    return gulp.src('./src/*.html')
      .pipe(inject(gulp.src('./src/assets/css/critical/critical.css'), { starttag: '<!-- critical:{{ext}} -->', ...conf }))
      .pipe(gulp.dest('./src/'));
  });

var options = { };

const htmlFile = [
    'src/*.html'
]

/**
 * STATIC HTML (For Frontend Testing)
 */
gulp.task('html', function() {
    return gulp.src('src/html/*.{html,json}')
        .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        }))
        .pipe(htmlbeautify())
        .pipe(inject(gulp.src('./src/assets/css/critical/critical.css'), { starttag: '<!-- critical:{{ext}} -->', ...conf }))
        .pipe(gulpIf(isProduction, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('src/'));
});

/**
 * STYLESHEETS
 */
gulp.task('sass', function(){
    return gulp.src('./src/scss/**/*.scss')
        .pipe( gulpIf( !isProduction, sourcemaps.init() ) )
        .pipe( sass() )
        .pipe( autoprefixer( {
            cascade: true
        }))
        .pipe( gulpIf( isProduction, cleanCSS()) )
        .pipe( gulpIf( !isProduction, sourcemaps.write() ) )
        .pipe(rename({suffix: ".min"}))
        .pipe( gulp.dest('./src/assets/css') )
});


/**
 * JAVASCRIPTS CONCATENATION
 */
gulp.task('js', function(){
    return gulp.src('./src/js/**/*.js')
        .pipe( gulpIf( !isProduction, sourcemaps.init() ) )
        .pipe( gulpIf( isProduction, uglify()) )
        .pipe(concat('main.js'))
        .pipe( gulpIf( !isProduction, sourcemaps.write() ) )
        .pipe(rename({suffix: ".min"}))
        .pipe( gulp.dest('./src/assets/js') )
});

gulp.task('img', function(){
  return gulp.src('./src/images/*')
      .pipe( gulp.dest('./src/assets/images') )
});

gulp.task('fonts', function(){
  return gulp.src('./src/fonts/*.{eot,svg,ttf,woff,woff2}')
      .pipe( gulp.dest('./src/assets/fonts') )
});

/**
 * SVG SPRITES GENERATOR
 */
var config = {
    shape: {
      dimension: { // Set maximum dimensions
        maxWidth: 32,
        maxHeight: 32
      }
    },
    mode: {
      symbol: { // symbol mode to build the SVG
        dest: 'assets/images', // destination foldeer
        sprite: 'sprite.svg', //sprite name
        inline: true,
        example: true // Build sample page
      },
      css: {
        render: {
          scss: {
            dest: "_sprite.scss"
          }
        },
        sprite: "../assets/images/sprite/sprite",
        dest: "scss/utilities"
      }
    },
    svg: {
      xmlDeclaration: false, // strip out the XML attribute
      doctypeDeclaration: false // don't include the !DOCTYPE declaration
    }
};

gulp.task('svg', function () {
    return gulp.src('**/*.svg', {cwd: './src/svg'})
      .pipe(svgSprite(config))
      .pipe(gulp.dest("src/"));
});

gulp.task('svg-assets', function() {
    return gulp.src('./src/scss/assets/**/sprite-*.svg')
        .pipe(gulp.dest('./src/assets/'))
})


gulp.task('svgicons',gulp.series('svg','svg-assets'));

/**
 * CRITICAL CSS
 */
gulp.task('critical', function() {
    return gulp.src(['./src/assets/css/**/*.css','!**/*-critical.css','!**/critical.css'])
        .pipe(postcss([
        postcssCriticalSplit({
        })
    ]))
    .pipe(mergeCSS({ name: 'critical.css' }))
    .pipe( autoprefixer( {
        cascade: true
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./src/assets/css/critical'));
});

gulp.task('critical-split', function() {
    return gulp.src(['./src/assets/css/**/*.css','!./src/assets/css/critical','!**/*-critical.css','!**/critical.css'])
      .pipe(postcss([
      postcssCriticalSplit({
        'output' : 'rest'
      })
    ]))
    .pipe(gulp.dest('./src/assets/css'));
});
  
/**
 * WATCH
 */
gulp.task('serve', function(){
    browserSync.init({
      server: {
        baseDir: './src/'
      },
      open: true,
      ghostMode: false
    });
    
    gulp.watch('src/js/**/*.js', gulp.series('js')).on("change", browserSync.reload),
    gulp.watch('src/scss/**/*.scss', gulp.series('sass', 'critical-css', 'html')).on("change", browserSync.reload),
    gulp.watch('src/images/**/*.*', gulp.series('img'));
    gulp.watch('src/html/**/*.html', gulp.series('html')).on("change", browserSync.reload);
    gulp.watch('src/fonts/**/*.{eot,svg,ttf,woff,woff2}', gulp.series('fonts'));
    return
});


/**
 * COPY ASSETS
 */

// Set yarg production
async function setProduction(cb){
    isProduction = true;
    await Promise.resolve();
}
  
gulp.task('copy-assets', function () {
    return gulp.src('./src/assets/**/*', {base: 'src/assets'})
    .pipe(gulp.dest('../Prod/assets'));
});
  
gulp.task('critical-css', gulp.series('sass','critical','critical-split'))

/**
 * 
 * BACKEND TASKS
 *  
 */

gulp.task('dist', gulp.series(setProduction,'svgicons','sass','js','img','fonts','critical-css','html','copy-assets'));