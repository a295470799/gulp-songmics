const gulp = require('gulp');
const mincss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
var path  = require('path');

//使用说明：
//1._path路径默认为项目所在盘的根目录（D:/   E:/）
//2.sites为项目目录集合

var _path = path.resolve(__dirname, '..') + "/";
var sites = ["songmics_us","songmics_uk","songmics_fr"];


gulp.task('js',function(){
    for (var index = 0; index < sites.length; index++) {
        var element = sites[index];

        gulp.src(_path + element +"/public/static/web/js/*.js")
            .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest(_path + element +"/public/static/web/js/minify"));
    
        gulp.src(_path + element +"/public/static/web/js/giveaways/*.js")
            .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest(_path + element +"/public/static/web/js/minify"));
    }
})

gulp.task('css',function(){
    for (var index = 0; index < sites.length; index++) {
        var element = sites[index];

        gulp.src(_path + element +"/public/static/web/css/*.css")
            .pipe(mincss())
            .pipe(gulp.dest(_path + element +"/public/static/web/css/minify"));

        gulp.src(_path + element +"/public/static/web/css/giveaways/*.css")
            .pipe(mincss())
            .pipe(gulp.dest(_path + element +"/public/static/web/css/minify"));

        gulp.src(_path + element +"/public/static/web/css/subject/*.css")
            .pipe(mincss())
            .pipe(gulp.dest(_path + element +"/public/static/web/css/minify"));
        
    }
})

gulp.task('m-js',function(){
    for (var index = 0; index < sites.length; index++) {
        var element = sites[index];

        gulp.src(_path + element +"/public/static/m/js/*.js")
            .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest(_path + element +"/public/static/m/js/minify"));

        gulp.src(_path + element +"/public/static/m/js/giveaways/*.js")
            .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest(_path + element +"/public/static/m/js/minify"));
    }
})

gulp.task('m-css',function(){
    for (var index = 0; index < sites.length; index++) {
        var element = sites[index];

        gulp.src(_path + element +"/public/static/m/css/*.css")
            .pipe(mincss())
            .pipe(gulp.dest(_path + element +"/public/static/m/css/minify"));

        gulp.src(_path + element +"/public/static/m/css/giveaways/*.css")
            .pipe(mincss())
            .pipe(gulp.dest(_path + element +"/public/static/m/css/minify"));
        
        gulp.src(_path + element +"/public/static/m/css/subject/*.css")
            .pipe(mincss())
            .pipe(gulp.dest(_path + element +"/public/static/m/css/minify"));
    }
})

gulp.task("default", function () {
    for (var index = 0; index < sites.length; index++) {
        var element = sites[index];

        gulp.watch(_path + element +"/public/static/web/js/*.js", ["js"]);
        gulp.watch(_path + element +"/public/static/web/css/*.css", ["css"])
        gulp.watch(_path + element +"/public/static/web/js/giveaways/*.js", ["js"]);
        gulp.watch(_path + element +"/public/static/web/css/giveaways/*.css", ["css"]);
        gulp.watch(_path + element +"/public/static/web/css/subject/*.css", ["css"])
        gulp.watch(_path + element +"/public/static/m/js/*.js", ["m-js"]);
        gulp.watch(_path + element +"/public/static/m/css/*.css", ["m-css"])
        gulp.watch(_path + element +"/public/static/m/js/giveaways/*.js", ["m-js"]);
        gulp.watch(_path + element +"/public/static/m/css/giveaways/*.css", ["m-css"])
        gulp.watch(_path + element +"/public/static/m/css/subject/*.css", ["m-css"])
    }
})
