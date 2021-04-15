var debug_export = false;

var gulp = require('gulp');
var glob = require('glob');

var _if = require('gulp-if');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var pug = require('gulp-pug');

var rimraf = require('gulp-rimraf');
var replace = require("gulp-replace");
var jshint = require("gulp-jshint");

gulp.task("css", function(){
	return build_css();
});

var JADE_LOCALS = {
	data: {
		skin: "flat",
		skinExtension: true,
		skinsList: ["compact", "contrast", "flat", "material", "mini"],
		userMode: true
	}
};

function build_css(){
	return gulp.src('./assets/*.css')
		.pipe(gulp.dest('./deploy/assets'));
}

gulp.task('js', function(done) {
	return build_js();
});

function build_js(){
	var views = glob.sync("views/**/*.js").map(function(value){
		return value.replace(".js", "");
	});

	var locales = glob.sync("locales/**/*.js").map(function(value){
		return value.replace(".js", "");
	});

	return gulp.src("./app.js")
		.pipe(rjs({
			baseUrl: './',
			out: 'app.js',
			insertRequire:["app"],
			optimize: "none",
			paths:{
				"locale" : "empty:",
				"text": 'libs/text'
			}, 
			deps:["app"],
			include: ["libs/almond/almond.js"].concat(views).concat(locales)
		}))
		.pipe(babel({
			presets: [
				["@babel/preset-env"]
			]
		}))
		.pipe( _if(debug_export, sourcemaps.init()) )
		.pipe(uglify())
		.pipe( _if(debug_export, sourcemaps.write("./")) )
		.pipe(gulp.dest('./deploy/'));
}

gulp.task("clean", function(){
	return gulp.src("deploy/*", {read: false}).pipe(rimraf());
});

gulp.task('build', gulp.series("clean", function(done) {
	var build = (new Date())*1;
	const mergeStream = require('merge-stream');

	return mergeStream(
	build_js(),
	build_css(),
		//assets
	gulp.src("./assets/imgs/**/*.*")
		.pipe(gulp.dest("./deploy/assets/imgs/")),
		//copy libs
	gulp.src(['./libs/**/*'])
		.pipe(gulp.dest('./deploy/libs')),
		//index
	gulp.src("./index.pug")
		.pipe(pug({locals: JADE_LOCALS, pretty: true}))
		.pipe(replace('data-main="app" src="libs/requirejs/require.js"', 'src="app.js"'))
		.pipe(replace('<script type="text/javascript" src="libs/less.min.js"></script>', ''))
		.pipe(replace(/rel\=\"stylesheet\/less\" href=\"(.*?)\.less\"/g, 'rel="stylesheet" href="$1.css"'))
		.pipe(replace(/\.css\"/g, '.css?'+build+'"'))
		.pipe(replace(/\.js\"/g, '.js?'+build+'"'))
		.pipe(replace("require.config", "webix.production = true; require.config"))
		.pipe(replace(/libs\/webix\/codebase\//g, '//cdn.webix.com/edge/'))
		.pipe(gulp.dest("./deploy/")),
		//server
	gulp.src(["../server/**/*.*", 
			  "!./server/*.log", "!./server/config.*",
			  "!./server/dev/**/*.*", "!./server/dump/**/*.*"])
		.pipe(gulp.dest("./deploy/server/")),
	);
}))

gulp.task('copy_modules', function() {
	const mergeStream = require('merge-stream');
	return mergeStream(
		gulp.src("./node_modules/openseadragon/build/openseadragon/**/*.*")
			.pipe(gulp.dest("./libs/openseadragon/")),
		gulp.src("./node_modules/openseadragon-filtering/openseadragon-filtering.js")
			.pipe(gulp.dest("./libs/openseadragon-filtering/")),
		gulp.src("./node_modules/vanilla-picker/dist/**/*.js")
			.pipe(gulp.dest("./libs/vanilla-picker/")),
		gulp.src("./node_modules/file-saver/dist/**/*.js")
			.pipe(gulp.dest("./libs/file-saver/"))
	);
});

gulp.task('lint', function() {
  return gulp.src(['./views/**/*.js', './helpers/**/*.js', './models/**/*.js', './*.js', "!./jshint.conf.js"])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});