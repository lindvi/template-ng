// Include gulp
var gulp = require('gulp');

// Include dependencies
var del = require('del');

// Include options
var options = require('./options');

// Include gulp plugins
var compass = require('gulp-compass'),
concat = require('gulp-concat'),
cssmin = require('gulp-minify-css'),
declare = require('gulp-declare'),
defineModule = require('gulp-define-module'),
gulpif = require('gulp-if'),
addsrc = require('gulp-add-src'),
imagemin = require('gulp-imagemin'),
jshint = require('gulp-jshint'),
autoprefixer = require('gulp-autoprefixer'),
livereload = require('gulp-livereload'),
plumber = require('gulp-plumber'),
rename = require('gulp-rename'),
replace = require('gulp-replace'),
uglify = require('gulp-uglify'),
html2string = require('gulp-html2string');

// Include Node specific dependencies
if (options.node) {
	var tasks,
	nodemon = require('gulp-nodemon');
}

// Define paths as variables for easier use
var paths = {
	css: ['css'],
	sass: ['sass'],
	fonts: ['fonts'],
	html: ['html'],
	images: ['img'],
	jshint: [
	'**/*.js',
	'src/js/classes/*.js',
	'!wp/**',
	'!content/**',
	'!node_modules/**/*.js',
	'!src/js/libs/**/*.js',
	'!src/js/templates/*.js',
	'!views/**/*.hbs',
	'!public/js/**/*.js'
	],
	scripts: ['js'],
	templates: ['templates'],
	dev: ['src'],
	dest: ['public'],
	nodemonIgnore: [
	'.sass-cache/',
	'.git/',
	'node_modules/**',
	'src/**',
	'public/**',
	'views/**'
	]
};

// Is production check
var isProduction = false;

// Assign production true
// removes js comments, uglify and minify css 
// for production
gulp.task('isProduction', function() {
	isProduction = true;
});


// Is jenkins deploy check
var isJenkins = false;

// Assign it is a Jenkins build
// Removes all livereloads, will be deployed as static website
// Used for all automatic deploys.
gulp.task('isJenkins', function() {
	isJenkins = true;
});

// JS Hint task
gulp.task('hint', function() {
	return gulp.src(paths.jshint)
		// Pass in options to the task
		.pipe(plumber())
		.pipe(jshint({ laxcomma: true }))
		.pipe(jshint.reporter('jshint-stylish'));
	});



// Concat and uglify Modernizr
// Separate task so we can place this in the html head
gulp.task('scripts-modernizr', function() {
	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src([
		paths.dev + '/' + paths.scripts + '/libs/modernizr.js'
		])
	.pipe(plumber())
	.pipe(concat('modernizr.js'))
	.pipe(replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, ''))
	.pipe(uglify('modernizr.js'))
	.pipe(gulp.dest(paths.dest + '/' + paths.scripts));
});


gulp.task('scripts-qrcode', function() {
	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src([
		paths.dev + '/' + paths.scripts + '/libs/jquery.qrcode.min.js'
		])
	.pipe(plumber())
	.pipe(concat('jquery.qrcode.min.js'))
	.pipe(replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, ''))
	.pipe(gulp.dest(paths.dest + '/' + paths.scripts));
});


// Concat (and uglify if production mode) Vendor JavaScript
gulp.task('scripts-vendor', function() {
	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src([
		paths.dev + '/' + paths.scripts + '/libs/jquery.js',
		//paths.dev + '/' + paths.scripts + '/libs/JsBarcode.js',
		paths.dev + '/' + paths.scripts + '/libs/js.cookie.js',
		//paths.dev + '/' + paths.scripts + '/libs/jquery.qrcode.min.js',
		'!' + paths.dev + '/' + paths.scripts + '/libs/modernizr.js'
		])
	.pipe(plumber())
	.pipe(concat('libs.js'))
	.pipe(gulpif(isProduction, replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, '')))
	//.pipe(gulpif(isProduction, uglify('libs.js')))
	.pipe(gulp.dest(paths.dest + '/' + paths.scripts))
	.pipe(gulpif(!isJenkins,livereload()));
});

// Concat (and uglify if production mode) 
// Everything else JavaScript
gulp.task('scripts', function() {
	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src([
		paths.dev + '/' + paths.scripts + '/classes/BankIdController.js',
		paths.dev + '/' + paths.scripts + '/classes/BarcodeController.js',
		paths.dev + '/' + paths.scripts + '/classes/BarcodeService.js',
		paths.dev + '/' + paths.scripts + '/classes/ErrorController.js',
		paths.dev + '/' + paths.scripts + '/classes/HandoffController.js',
		paths.dev + '/' + paths.scripts + '/classes/IdentityController.js',
		paths.dev + '/' + paths.scripts + '/classes/LocalStorage.js',
		paths.dev + '/' + paths.scripts + '/classes/StartController.js',
		paths.dev + '/' + paths.scripts + '/classes/State.js',
		paths.dev + '/' + paths.scripts + '/classes/CookieService.js',
		paths.dev + '/' + paths.scripts + '/classes/Translator.js',
		paths.dev + '/' + paths.scripts + '/classes/PabloService.js',
		paths.dev + '/' + paths.scripts + '/classes/IDService.js',
		paths.dev + '/' + paths.scripts + '/app.js'
		])
	.pipe(plumber())
	.pipe(concat('app.js'))
	.pipe(gulpif(isProduction, replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, '')))
	.pipe(gulpif(isProduction, uglify('app.js')))
	.pipe(gulp.dest(paths.dest + '/' + paths.scripts))
	.pipe(gulpif(!isJenkins,livereload()));
});

gulp.task('scripts-loader', function() {
	return gulp.src([
		paths.dev + '/' + paths.scripts + '/postnord.js'
		])
	.pipe(concat('postnord.js'))
	.pipe(gulpif(isProduction, replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, '')))
	.pipe(gulpif(isProduction, uglify('postnord.js')))
	//.pipe(addsrc.prepend(paths.dev + '/' + paths.scripts + '/loader-classes/Postnord-app-links.js'))
	//.pipe(addsrc.prepend(paths.dev + '/' + paths.scripts + '/loader-classes/Postnord-site-links.js'))
	.pipe(concat('postnord.js'))
	.pipe(gulp.dest(paths.dest + '/' + paths.scripts))
	.pipe(gulpif(!isJenkins,livereload()));
});


// Compile SASS
gulp.task('compass', function() {
	return gulp.src(paths.dev + '/' + paths.sass + '/**/*.scss')
	.pipe(plumber())
		// Pass in options to the task to replace config.rb
		.pipe(compass({
			css: paths.dest + '/' + paths.css,
			sass: paths.dev + '/' + paths.sass,
			image: paths.dest + '/' + paths.images,
			javascript: paths.dest + '/' + paths.scripts,
			font: paths.dest + '/' + paths.fonts,
			html: paths.dest + '/' + paths.html,
			style: 'nested',
			time: true
		}))
		.pipe(gulpif(isProduction, cssmin()))
		.pipe(gulp.dest(paths.dest + '/' + paths.css))
		.pipe(gulpif(!isJenkins,livereload()));
	});

// Compile SASS
gulp.task('compass-noqueries', ['compass'], function() {
	return gulp.src(paths.dev + '/' + paths.sass + '/postnord-widget.scss')
	.pipe(plumber())
		// Pass in options to the task to replace config.rb
		.pipe(compass({
			css: paths.dest + '/' + paths.css,
			sass: paths.dev + '/' + paths.sass,
			image: paths.dest + '/' + paths.images,
			javascript: paths.dest + '/' + paths.scripts,
			font: paths.dest + '/' + paths.fonts,
			html: paths.dest + '/' + paths.html,
			style: 'nested',
			time: true
		}))
		.pipe(rename({
			suffix: ".no-queries",
			extname: '.css'
		}))
		.pipe(cssmin())
		.pipe(replace(/@media screen[^{]+\{([\s\S]+?})\s*}/g, ''))
		.pipe(replace(/@media only screen[^{]+\{([\s\S]+?})\s*}/g, ''))
		.pipe(gulp.dest(paths.dest + '/' + paths.css))
		.pipe(gulpif(!isJenkins,livereload()));
	});

// Copy all static images & optimize
gulp.task('images', function() {
	return gulp.src([
		paths.dev + '/' + paths.images + '/*.{jpg,gif,svg,jpeg,png}',
		paths.dev + '/' + paths.images + '/**/*.{jpg,gif,svg,jpeg,png}',
		])
	.pipe(plumber())
		// Pass in options to the task
		.pipe(gulpif(isProduction, imagemin({optimizationLevel: 0})))
		.pipe(gulp.dest(paths.dest + '/' + paths.images));
	});

// Copy task
gulp.task('copy', function() {
	return gulp.src([
		paths.dev + '/*',
		paths.dev + '/*/**',
		paths.dev + '/.*/**',
		'!' + paths.dev + '/' + paths.images + '/*',
		'!' + paths.dev + '/' + paths.images + '/**/*',
		'!' + paths.dev + '/' + paths.sass + '/',
		'!' + paths.dev + '/' + paths.sass + '/**',
		'!' + paths.dev + '/' + paths.scripts + '/**'
		])
	.pipe(plumber())
	.pipe(gulp.dest(paths.dest + '/'))
	.pipe(gulpif(!isJenkins,livereload()));
});

gulp.task('html', function() {
	return gulp.src([
		paths.dev + '/*.{html, php, htm}',
		paths.dev + '/*/*.{html, php, htm}'
		])
	.pipe(plumber())
	.pipe(gulp.dest(paths.dest + '/'))
	.pipe(livereload());
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch(paths.dev + '/' + paths.scripts + '/libs/*.js', ['scripts-vendor']);
	gulp.watch([
		paths.dev + '/' + paths.scripts + '/*.js',
		paths.dev + '/' + paths.scripts + '/classes/*.js'
		], ['hint', 'scripts', 'scripts-loader']);
	gulp.watch(paths.dev + '/' + paths.sass + '/**/*.scss', ['compass', 'compass-noqueries']);
	gulp.watch(paths.dev + '/' + paths.images + '/**/*', ['images']);
	gulp.watch([
		paths.dev + '/*',
		paths.dev + '/**/*',
		], ['copy']);
	gulp.watch([
		paths.dev + '/*.{html, php, htm}',
		paths.dev + '/*/*.{html, php, htm}',
		], ['html']);
});

// Task to run all tasks
gulp.task('base', ['copy', 'compass', 'compass-noqueries', 'scripts-modernizr', 'scripts-qrcode', 'scripts-vendor', 'scripts', 'scripts-loader', 'images', 'hint']);
// Node specific tasks
gulp.task('node', []);

// If node option is enabled, do node specific tasks
if (options.node) {
	tasks = ['base', 'node', 'watch'];
} else {
	tasks = ['base', 'watch'];
}

// Use this task for development mode (does not uglify or minify)
// Uses nodemon to restart server for development
gulp.task('production', ['isProduction', 'base']);

// Use this task when building jenkins to perform production and deploy static content.
// Will prevent all livereloads, since deploy environments are static
gulp.task('jenkins', ['isProduction', 'isJenkins', 'base']);

// The default task (called when you run `gulp` from cli)
// The default is production mode
// Use this task to deploy your server
gulp.task('default', tasks, function() {
	if (options.node) {
		// listen for changes
		livereload.listen();
		// configure nodemon
		nodemon({
			// the script to run the app
			script: 'web.js',
			ext: 'html js css',
			ignore: [
			paths.nodemonIgnore
			]
		}).on('restart', function(){
			// when the app has restarted, run livereload.
			gulp.src('web.js')
			.pipe(livereload());
		});
	}
});