const 
    gulp = require('gulp'),
    mincss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    watch = require('gulp-watch'),
    es2015 = require("babel-preset-es2015"),
    path  = require('path');

//使用说明：
//1._path路径默认为项目所在盘的根目录（D:/   E:/）
//2._sites为项目目录集合

const _path = path.resolve(__dirname, '..') + '/';
const _sites = ["songmics_us","songmics_uk","songmics_fr","songmics_es","songmics_it","songmics_de","songmics_jp"];

function forJs(client){
    for (var i = 0; i < _sites.length; i++) {
        gulp.src(`${_path}${_sites[i]}/public/static/${client}/js/*.js`)
            .pipe(babel({presets:[es2015]}))
            .pipe(uglify())
            .pipe(gulp.dest(`${_path}${_sites[i]}/public/static/${client}/js/minify`));
    }
}

function forWatchJs(path, element){
    gulp.src(path)
        .pipe(babel({presets:[es2015]}))
        .pipe(uglify())
        .pipe(gulp.dest(`${element}\\minify`));
}

function forCss(client){
    for (var i = 0; i < _sites.length; i++) {
        gulp.src(`${_path}${_sites[i]}/public/static/${client}/css/*.css`)
            .pipe(mincss())
            .pipe(gulp.dest(`${_path}${_sites[i]}/public/static/${client}/css/minify`));
        
        gulp.src(`${_path}${_sites[i]}/public/static/${client}/css/giveaways/*.css`)
            .pipe(mincss())
            .pipe(gulp.dest(`${_path}${_sites[i]}/public/static/${client}/css/minify`));

        gulp.src(`${_path}${_sites[i]}/public/static/${client}/css/subject/*.css`)
            .pipe(mincss())
            .pipe(gulp.dest(`${_path}${_sites[i]}/public/static/${client}/css/minify`));
    }
}

function forWatchCss(path, element){
    gulp.src(path)
        .pipe(mincss())
        .pipe(gulp.dest(`${element}\\minify`));
}

gulp.task('js', () =>{
    forJs('web');
})

gulp.task('css', () =>{
    forCss('web');
})

gulp.task('m-js', () =>{
    forJs('m');
})

gulp.task('m-css', () =>{
    forCss('m');
})

gulp.task('build',['js','css','m-js','m-css']);

gulp.task("default", () => {
    for (var i = 0; i < _sites.length; i++) {
        var element = _sites[i];

        watch(`${_path}${element}/public/static/web/js/*.js`, function(event){
            forWatchJs(event.path, event.dirname);
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });

        watch(`${_path}${element}/public/static/web/css/*.css`, function(event){
            forWatchCss(event.path, event.dirname);
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });

        watch(`${_path}${element}/public/static/web/css/giveaways/*.css`, function(event){
            forWatchCss(event.path, event.dirname.replace("\\giveaways", ""));
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });

        watch(`${_path}${element}/public/static/web/css/subject/*.css`, function(event){
            forWatchCss(event.path, event.dirname.replace("\\subject", ""));
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });

        watch(`${_path}${element}/public/static/m/js/*.js`, function(event){
            forWatchJs(event.path, event.dirname);
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });

        watch(`${_path}${element}/public/static/m/css/*.css`, function(event){
            forWatchCss(event.path, event.dirname);
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });

        watch(`${_path}${element}/public/static/m/css/giveaways/*.css`, function(event){
            forWatchCss(event.path, event.dirname.replace("\\giveaways", ""));
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });

        watch(`${_path}${element}/public/static/m/css/subject/*.css`, function(event){
            forWatchCss(event.path, event.dirname.replace("\\subject", ""));
            console.log(`[${new Date().toLocaleTimeString()}] File ${event.path} was modified...`);
        });
    }
})