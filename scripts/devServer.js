const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('../webpack.config.dev.js');

const app = express();
const compiler = webpack(config);

const {
  HOST = 'localhost',
  PORT = 3000
} = process.env;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('*', function (req, res) {
  res.sendFile(
      path.resolve('index.html')
  )
});


app.listen(PORT, HOST, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://${HOST}:${PORT}`);
});