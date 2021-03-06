var gulp      = require('gulp'),
    connect   = require('gulp-connect'),
    stylus    = require('gulp-stylus'),
    nib       = require('nib'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    inject    = require('gulp-inject'),
    wiredep   = require('wiredep').stream,
    gulpif    = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref    = require('gulp-useref'),
    uglify 	  = require('gulp-uglify'),
    watch 	  = require('gulp-watch'),
    gutil 	  = require('gulp-util'),
    templateCache = require('gulp-angular-templatecache'),
    historyApiFallback = require('connect-history-api-fallback');

// Servidor web de desarrollo 
gulp.task('server', function() {  
	connect.server({    
		root: './app',    
		hostname: '0.0.0.0',    
		port: 2000,    
		livereload: true,    
		middleware: function(connect, opt) {      
			return [ historyApiFallback ];    
		}  
	}); 
});

gulp.task('server-produccion', function() {  
	connect.server({    
		root: './dist',    
		hostname: '0.0.0.0',    
		port: 2000,    
		livereload: true,    
		middleware: function(connect, opt) {      
			return [ historyApiFallback ];    
		}  
	}); 
});

// Busca errores en el JS y nos los muestra en el terminal 
gulp.task('jshint', function() {  
	return gulp.src('./app/scripts/**/*.js')    
	.pipe(jshint('.jshintrc'))    
	.pipe(jshint.reporter('jshint-stylish'))    
	.pipe(jshint.reporter('fail')); 
});

// Recarga el navegador cuando hay cambios en el HTML 
gulp.task('html', function() {  
	gulp.src('./app/**/*.html')    
	.pipe(connect.reload()); 
});

// manejo de templates 
gulp.task('templates', function () {
  return gulp.src('./app/views/**/*.html')
    .pipe(templateCache({      
			module: 'app.templates',      
			standalone: true,
			base:function(file){				
				var ruta = file.relative;
				var fic = ruta.replace(/^.*[\\\/]/,'').split('/');
				var fileOnly = fic[fic.length - 1];
				return fileOnly;
			}
    }))
    .pipe(gulp.dest('./app/scripts'));
});

// Busca en las carpetas de estilos y javascript los archiv os que hayamos creado // para inyectarlos en el index.html 
gulp.task('inject', function() {  
	var sources = gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.css']);  
	return gulp.src('index.html', {cwd: './app'})    
	.pipe(inject(sources, {      
		read: false,      
		ignorePath: '/app/'    
	}))    
	.pipe(gulp.dest('./app')); 
}); 

// Inyecta las librerias que instalemos vía Bower 
gulp.task('wiredep', function () {  
	gulp.src('./app/index.html')    
	.pipe(wiredep({ directory: './app/lib'}))   
	.pipe(gulp.dest('./app')); 
});

gulp.task('watch', function() { 
	gulp.watch(['./app/**/*.html'], ['html']);
	gulp.watch(['./app/views/**/*.html'], ['templates']);  
	gulp.watch(['./app/stylesheets/**/*.styl'], ['css','inject']);  
	gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['inject']);  
	gulp.watch(['./bower.json'],['wiredep']); 
	watch('./app').pipe(connect.reload());
});

gulp.task('compress', function() {  
	gulp.src('./app/index.html')    
	.pipe(useref.assets())    
	.pipe(gulpif('*.css', minifyCss()))    
	.pipe(gulpif('*.js', uglify({mangle: false }).on('error', gutil.log)))    
	.pipe(gulp.dest('./dist')); 
});


gulp.task('copy', function() {  
	gulp.src('./app/index.html')    
	.pipe(useref())    
	.pipe(gulp.dest('./dist'));   
	// gulp.src('./app/views/*.html')        
	// .pipe(gulp.dest('./dist/views')); 
	gulp.src('./app/img/**')        
	.pipe(gulp.dest('./dist/img'));
});

gulp.task('produccion', ['templates','compress','copy']);

gulp.task('default', ['server','templates','inject','wiredep', 'watch']);