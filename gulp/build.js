'use strict';

module.exports = (gulp) => {
	gulp.task('build', ['clean', 'build:html', 'build:assets', 'webpack:build']);
	gulp.task('build-dev', ['clean', 'build:html', 'build:assets', 'webpack:build-dev']);
};
