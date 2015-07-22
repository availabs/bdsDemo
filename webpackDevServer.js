var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: false, /* Seems necessary to prevent Grunt errors. */
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': 'http://localhost:1234' },
}).listen(11235, 'localhost', function (err, result) {
  if (err) {
    console.error(err);
  }

  console.log('Listening at localhost:11235');
});

