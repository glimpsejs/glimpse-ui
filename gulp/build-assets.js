'use strict';

module.exports = (gulp) => {
	gulp.task('build:assets', () => {
		gulp.src('src/assets/**/*').pipe(gulp.dest('dist/assets'));
	});
};
