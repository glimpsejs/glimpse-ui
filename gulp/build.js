'use strict';

import mkdirp from 'mkdirp';
import path from 'path';

module.exports = function build(gulp, plugins) {
	gulp.task('build', ['clean'], (done) => {
		mkdirp(path.resolve('dist/app'), function(err, made) {
			if (err) throw new plugins.util.PluginError('build', err);
			if (made) {
				plugins.util.log(`[INFO] build directory at: ${made}`);
			}
			done();
		});
	});
};
