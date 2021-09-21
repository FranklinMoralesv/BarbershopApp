const { series, src, dest, watch } = require('gulp');

var sass = require('gulp-sass')(require('sass'));

const imagemin  = require('gulp-imagemin');

//const notify = require('gulp-notify');

const webp = require('gulp-webp');

const concat = require('gulp-concat');

// Utilidades CSS

const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

// Utilidades JS

var uglify = require('gulp-uglify');
//const rename = require('gulp-rename');

const paths = {
    images: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}

 function css() {
     return src(paths.scss)//busca el path
         .pipe( sourcemaps.init() )
         .pipe( sass())//lo compila
         .pipe( postcss([ autoprefixer(), cssnano() ]))
         .pipe( sourcemaps.write('.') )
         .pipe( dest('./build/css') )//donde se guarda la version compilada
 }



function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe( concat('bundle.js') )
        .pipe( uglify() )
        .pipe(sourcemaps.write('.'))
       // .pipe( rename({ suffix: '.min' }))
        .pipe( dest('./build/js') )
}




 function imagesMin() {
     return src(paths.images)
         .pipe( imagemin() )
         .pipe( dest( './build/img' ))
         ;
         //.pipe( notify({ message: 'Minified Image Completed'}) )
 }

function imagesWebp() {
    return src(paths.images)
        .pipe( webp() )
        .pipe( dest('./build/img'));
        //.pipe( notify({message: 'Versión webP lista'}));
}

function watchFiles() {
    watch( paths.scss, css ); // * = La carpeta actual - ** = Todos los archivos con esa extensión
    watch(paths.js, javascript);
}

exports.css = css;
exports.imagesMin = imagesMin;
exports.watchFiles = watchFiles;
exports.imagesWebp=imagesWebp;

//el default es la tarea que se ejecuta al colocar solamente gulp

exports.default = series( css,javascript,imagesMin,imagesWebp,watchFiles);//Permite ejecutar las tareas en series
