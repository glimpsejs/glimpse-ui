'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

const HOST = 'localhost';
const PORT = 8080;
const NAME = 'webpack-dev-server';

module.exports = function webpackDev(gulp, plugins) {
	gulp.task('webpack-dev', () => {
		var compiler = webpack(require('../webpack.config'));

		new WebpackDevServer(compiler, {

		}).listen(PORT, HOST, (err) => {
			if (err) throw new plugins.util.PluginError(NAME, err);
			plugins.util.log(`[${NAME}]', 'http://${HOST}:${PORT}/webpack-dev-server/index.html`)
		});
	});
};
