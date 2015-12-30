'use strict';

import rimraf from 'rimraf';
import path from 'path';

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