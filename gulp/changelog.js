'use strict';

module.exports = function changelog(gulp, plugins) {
	gulp.task('changelog', function() {
		return gulp.src('CHANGELOG.md', {
			buffer: false
		})
		.pipe(plugins.conventionalChangelog({
			preset: 'angular'
		}))
		.pipe(gulp.dest('./'));
	});
};