var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

require('fs').readdirSync('./gulp').forEach((file) => {
	if (require('path').extname(file) === '.js') {
		require(`./gulp/${file}`)(gulp, plugins);
	}
});

gulp.task('default', () => {
	console.info('gulp!');
});

process.on('uncaughtException', (err) => {
	if (err) {
		plugins.util.log(err);
		console.trace(err);
	}
});

process.on('exit', () => {
	if (gulp.fail) {
		// return non-zero exit code
		process.exit(1);
	}
});
