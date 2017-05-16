var gulp = require('gulp')
//styles
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var inlinesource = require('gulp-inline-source');
var htmlclean = require('gulp-htmlclean');
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
// requires browserify and vinyl-source-stream
var browserify = require('browserify');
var source = require('vinyl-source-stream');
// files
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var addsrc = require('gulp-add-src')  
//angular
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
/*
// cleans the build output
*/
/*
gulp.task('clean', function (cb) {
    del([
        './public'
    ]);
});

*/
/*
// concat less, autoprefix it and compile.
*/

/*gulp-watch css*/
gulp.task('less-to-css', function(){
  return gulp.src(['assets/less/*.less','./app/**/**/*.less','node_modules/object-fit-images/preprocessors/mixin.less'])
  .pipe(concat('build.less'))
  .pipe(less({
    plugins: [autoprefix, cleancss]
  }))
  .pipe(rename('build.css'))
  .pipe(minifyCSS())
  .pipe(gulp.dest('./public/assets/css'));
  })


gulp.src('./assets/fonts/*.css')
  .pipe(minifyCSS())
  .pipe(gulp.dest('./public/assets/fonts/'));




/*
//browserify
*/

gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./app/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./temp/js/'));
})


/*
//templateCache
*/
gulp.task('templatescache', function () {
  return gulp.src('./app/**/**/*.tpl.html')
    .pipe(templateCache('templatescache.js', { module:'templatescache', standalone:true, root: './app/' }))
    .pipe(gulp.dest('temp/js'));
});
//Minify js code
gulp.task('minifyAngularjs', ['browserify', 'templatescache'], function(){
  return gulp.src(['./temp/js/main.js', './node_modules/angular-ui-router/release/angular-ui-router.min.js', './temp/js/templatescache.js', './node_modules/angularfire/dist/angularfire.min.js'])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    /*.pipe(uglify())*/
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('minifyjs', ['browserify'], function(){
  return gulp.src(['./assets/js/*.js'])
    .pipe(concat('build.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('vendorjs', ['browserify'], function(){
  return gulp.src(['./assets/vendor/*.js', 'node_modules/firebase/firebase-app.js', 'node_modules/firebase/firebase-auth.js', 'node_modules/firebase/firebase-database.js','node_modules/firebase/firebase-storage.js', 'node_modules/firebase/firebase-messaging.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('inlinesource index',['minify-inline-js'], function () {
    var options = {
        compress: true
    };
 
    return gulp.src('./index.html')
        .pipe(inlinesource(options))
        .pipe(gulp.dest('./public/'));
});

gulp.task('pages partials', function () {
    return gulp.src('./app/components/**/*View.html')
      .pipe(rename({dirname: ''}))
      .pipe(gulp.dest('./public/partials/'));
});

gulp.src(['./assets/videos/**/*']).pipe(gulp.dest('./public/assets/videos/'));
gulp.src(['./assets/img/**/*']).pipe(gulp.dest('./public/assets/img/'));
gulp.src(['./assets/img/projects/**/*']).pipe(gulp.dest('./public/img/'));

gulp.task('move templates', function () {
  return gulp.src('./app/**/**/*.tpl.html')
    .pipe(gulp.dest('./public/app/'));
});

gulp.task('minify-inline-js', function(){
  return gulp.src('./assets/inline/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./temp/'))
  })

  gulp.task('move json', function(){
    return gulp.src('./app/**/**/*.json')
    .pipe(gulp.dest('./public/json/'));
    })

gulp.watch(['./app/**/**/*.js'], ['browserify', 'templatescache', 'minifyAngularjs']);

gulp.watch(['assets/less/*.less','./app/**/**/*.less'], ['less-to-css']);
gulp.watch(['./app/**/**/*.tpl.html'], ['templatescache', 'move templates']);
gulp.watch(['./index.html'],['inlinesource index']);
gulp.watch(['./assets/inline/*.js'],['minify-inline-js']);
gulp.watch(['./app/**/**/*.json'], ['move json']);

gulp.task('default', ['browserify', 'templatescache', 'minifyAngularjs', 'minifyjs', 'vendorjs', 'inlinesource index',  'pages partials', 'move templates', 'less-to-css', 'minify-inline-js', 'move json']);

