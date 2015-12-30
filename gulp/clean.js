'use strict';

var rimraf = require('rimraf');

module.exports = function(gulp, plugins) {
	gulp.task('clean', (done) => {
		rimraf(`${__dirname}/dist`, function(err) {
			if (err) {
				plugins.util.log(err);
			}
			done();
		});
	});
};