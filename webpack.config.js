
module.exports = {
  entry: 'src/main.js',
  output: {
      path:  __dirname,
      filename: 'dist/bundle.js'
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
          {
              test: /\.scss$/,
              loaders: ['style', 'css', 'sass']
          }
      ]
  }
};
