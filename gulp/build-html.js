'use strict';

var fs = require('fs');
var path = require('path');

module.exports = (gulp, plugins) => {
	gulp.task('build:html', () => {
		gulp.src(['src/*.html']).pipe(gulp.dest('dist/'));
	});
};
