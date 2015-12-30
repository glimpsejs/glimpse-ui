'use strict';

var webpack = require('webpack');

module.exports = function webpack(gulp, plugins) {
	gulp.task('webpack', (callback) => {
		webpack(require('../webpack.config'), function(err, stats) {
			if (err) throw new plugins.util.PluginError('webpack', err);
			gutil.log('[webpack]', stats.toString());
		});
		callback();
	});
};
