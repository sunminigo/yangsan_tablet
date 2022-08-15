const gulp = require('gulp'),
	scss = require("gulp-sass")(require('sass')),
	sourcemaps = require('gulp-sourcemaps'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	include = require('gulp-file-include'),
	plumber = require('gulp-plumber');

// 소스 파일 경로
const PATH = {
		HTML: './workspace/html',
		ASSETS: {
			FONTS: './workspace/assets/fonts',
			IMAGES: './workspace/assets/images',
			STYLE: './workspace/assets/style',
			SCRIPT: './workspace/assets/script',
			LIB: './workspace/assets/lib',
		},
	},
	// 산출물 경로
	DEST_PATH = {
		HTML: './dist',
		ASSETS: {
			FONTS: './dist/assets/fonts',
			IMAGES: './dist/assets/images',
			STYLE: './dist/assets/style',
			SCRIPT: './dist/assets/script',
			LIB: './dist/assets/lib',
		},
	};

gulp.task('html-include', () => {
	return new Promise((resolve) => {
		gulp
			.src(PATH.HTML + '/**/*.html')
			.pipe(
				include({
					prefix: '@@',
					basepath: '@file',
					indent: true
				})
			)
			.pipe(gulp.dest(DEST_PATH.HTML))
			.pipe(browserSync.reload({ stream: true }));

		resolve();
	});
});

gulp.task('scss:compile', () => {
	return new Promise((resolve) => {
		var options = {
			outputStyle: 'expanded', // nested, expanded, compact, compressed
			indentType: 'tab', // space, tab
			indentWidth: 1,
			precision: 8,
			sourceComments: true, // 코멘트 제거
		};

		gulp
			.src(PATH.ASSETS.STYLE + '/*.scss')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(scss(options))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(DEST_PATH.ASSETS.STYLE))
			.pipe(browserSync.reload({ stream: true }));

		resolve();
	});
});

gulp.task('nodemon:start', () => {
	return new Promise((resolve) => {
		nodemon({
			script: 'app.js',
			watch: 'app',
		});

		resolve();
	});
});

gulp.task('script:concat', () => {
	return new Promise((resolve) => {
		gulp
			.src(PATH.ASSETS.SCRIPT + '/*.js')
			.pipe(concat('common.js'))
			.pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
			.pipe(browserSync.reload({ stream: true }));

		resolve();
	});
});

gulp.task('library', () => {
	return new Promise((resolve) => {
		gulp.src(PATH.ASSETS.LIB + '/**/*.*').pipe(gulp.dest(DEST_PATH.ASSETS.LIB));

		resolve();
	});
});

gulp.task('imagemin', () => {
	return new Promise((resolve) => {
		gulp
			.src(PATH.ASSETS.IMAGES + '/**/*.*')
			.pipe(
				imagemin([
					imagemin.gifsicle({ interlaced: false }),
					imagemin.mozjpeg({ progressive: true }),
					imagemin.optipng({ optimizationLevel: 5 }),
					imagemin.svgo({
						plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
					}),
				])
			)
			.pipe(gulp.dest(DEST_PATH.ASSETS.IMAGES))
			.pipe(browserSync.reload({ stream: true }));

		resolve();
	});
});

gulp.task('clean', () => {
	return new Promise((resolve) => {
		del.sync(DEST_PATH.HTML);

		resolve();
	});
});

gulp.task('watch', () => {
	return new Promise((resolve) => {
		gulp.watch(PATH.HTML + '/**/*.html', gulp.series(['html-include']));
		gulp.watch(PATH.ASSETS.STYLE + '/**/*.scss', gulp.series(['scss:compile']));
		gulp.watch(PATH.ASSETS.SCRIPT + '/**/*.js', gulp.series(['script:concat']));
		gulp.watch(PATH.ASSETS.LIB + '/**/*.*', gulp.series(['library']));
		gulp.watch(PATH.ASSETS.IMAGES + '/**/*.*', gulp.series(['imagemin']));

		resolve();
	});
});

gulp.task('browserSync', () => {
	return new Promise((resolve) => {
		browserSync.init(null, {
			proxy: 'http://localhost:8005',
			port: 8006,
		});

		resolve();
	});
});

// 호출 묶음
const ALL_SERIES = gulp.series([
	'clean',
	'scss:compile',
	'html-include',
	'script:concat',
	'library',
	'imagemin',
	'nodemon:start',
	'browserSync',
	'watch',
]);

gulp.task('default', ALL_SERIES);