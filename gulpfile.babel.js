var gulp = require('gulp');

require('fs').readdirSync('./gulp').forEach((file) => {
	if (require('path').extname(file) === '.js') {
		require(`./gulp/${file}`)(
				gulp,
				require('gulp-load-plugins')()
		);
	}
});

process.on('uncaughtException', (err) => {
	if (err) {
		console.trace(err);
	}
});

process.on('exit', () => {
	if (gulp.fail) {
		// return non-zero exit code
		process.exit(1);
	}
});
