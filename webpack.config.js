var webpack = require('webpack');

var env = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV || 'true'))
});

module.exports = {
  resolve: {
    moduleDirectories: ['node_modules'],
    extensions: ['', '.js', '.json', '.jsx', '.scss', 'css', 'png', 'jpg', 'jpeg', '.html', '.woff', '.eot', '.woff2', '.ttf', '.svg']
  },
  entry: {
    bundle: `${__dirname}/src/main.js`
  },
  output: {
      path:  `${__dirname}/dist`,
      filename: '[name].js'
  },
  module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					cacheDirectory: true, // use OS temp folder
					presets: ['react', 'es2015']
				}
			},
			{ test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
			{ test: /\.css$/, loaders: ['style', 'css'] },
      { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.html$/, loader: 'html-loader' },
      { test: '/\.(woff|woff2|eot|ttf|svg)$/', loader: 'url?limit=100000' }
		]
  },
  plugins: [env]
};
