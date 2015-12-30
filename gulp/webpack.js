'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack.config.js');

const HOST = 'localhost';
const PORT = 8080;
const NAME = 'webpack-dev-server';

module.exports = function(gulp, plugins) {
	gulp.task('webpack:build', (done) => {
		var config = Object.create(webpackConfig);

		webpack(config, function(err, stats) {
			if (err) throw new plugins.util.PluginError('webpack', err);
			plugins.util.log('[webpack:build]', stats.toString({
				colors: true
			}));
			done();
		});
	});

	var devConfig = Object.create(webpackConfig);
	devConfig.devtool = 'sourcemap';
	devConfig.debug = true;

	var devCompiler = webpack(devConfig);

	gulp.task('webpack:build-dev', (done) => {
		devCompiler.run((err, stats) => {
			if (err) throw new plugins.util.PluginError('webpack:build-dev', err);
			plugins.util.log(`[webpack:build-dev]`, stats.toString({
				colors: true
			}));
			done();
		});
	});

	gulp.task('webpack:dev-server', (done) => {
		var config = Object.create(webpackConfig);
		config.devtool = 'eval';
		config.debug = true;

		new WebpackDevServer(webpack(config), {
			publicPath: 'dist',
			filename: 'bundle.js',
			stats: {
				colors: true
			}
		}).listen(PORT, HOST, (err) => {
			if (err) throw new plugins.util.PluginError(NAME, err);
			plugins.util.log(`[${NAME}]', 'http://${HOST}:${PORT}/webpack-dev-server/index.html`);
		});
	});

};
