'use strict';

var rimraf = require('rimraf');
var path = require('path');

module.exports = function(gulp, plugins) {
	gulp.task('clean', (done) => {
		rimraf(path.resolve('dist'), function(err) {
			if (err) {
				plugins.util.log(err);
			}
			done();
		});
	});
};