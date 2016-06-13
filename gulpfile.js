/**
 * Created by isabol on 30. 3. 2016.
 */
/*global require*/
'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify= require('gulp-uglify'),
    csso = require('gulp-csso'),
    useref= require('gulp-useref'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    htmlmin=require('gulp-htmlmin'),
    ngAnnotate= require('gulp-ng-annotate'),
    browserSync = require('browser-sync');

gulp.task('scripts',function(){
   console.log('it worked!');
});
gulp.task('sass',function(){
    return gulp.src('app/sass/*.scss')
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest('app/css'))
});
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});
gulp.task('clean:dist',function(){
   return del.sync('dist');
});
gulp.task('useref',function(){
    return gulp.src('app/index.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', ngAnnotate()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});
gulp.task('imagemin',function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'));
});
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});
gulp.task('htmlmin',function(){
    return gulp.src(['app/**/*.html','!app/bower_components/**/*.html','!app/view1/**/*.html','!app/view2/**/*.html','!app/*.html'])
        .pipe(htmlmin({
            collapseWhitespace:true
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('jsondata',function(){
    return gulp.src('app/assets/**/*.json')
        .pipe(gulp.dest('dist/assets'))
})
gulp.task('htmlmin:directives',function(){
    return gulp.src('app/assets/directives/templates/*.html')
        .pipe(htmlmin({
            collapseWhitespace:true
        }))
        .pipe(gulp.dest('dist/assets/directives/templates'));
});
gulp.task('htmlmin:index',['build'],function(){
    return gulp.src('dist/index.html')
        .pipe(htmlmin({
            collapseWhitespace:true
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('clean:thumbs',function(){
    return del.sync('app/images/thumbnails');
});
gulp.task('copy-fonts',function(){
    return gulp.src('app/bower_components/bootstrap-sass/assets/fonts/bootstrap/**/*.*')
        .pipe(gulp.dest('dist/assets/bower_components/bootstrap-sass/assets/fonts/bootstrap'));
});
gulp.task('watch',['browserSync','sass'],function(){
    gulp.watch('app/sass/*.scss',['sass']);
    gulp.watch('app/app.js',browserSync.reload);
    gulp.watch('app/views/**/*.+(js|html)',browserSync.reload);
    gulp.watch('app/index.html',browserSync.reload);
    gulp.watch('app/assets/**/*.+(js|html|json)',browserSync.reload);
});
gulp.task('build',['clean:dist','sass','useref','imagemin','htmlmin','jsondata'],function(){
    console.log('Building files');
});
gulp.task('default',['scripts']);
gulp.task('serve:dist',['htmlmin:index','copy-fonts'],function(){
   browserSyncInit("dist");
});
function browserSyncInit(dir){
    if(dir==="dist"){
        browserSync.init({
            server: {
                baseDir: 'dist'
            },
        })
    }else{
        browserSync.init({
            server: {
                baseDir: 'app'
            },
        })
    }
};