
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('../webpack.config');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.set('port', 3100);
app.set('host', 'localhost');
const compiler = webpack(config);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('*', function (req, res) {
  res.sendFile(
      path.resolve('index.html')
  )
});

app.listen(app.get('port'), app.get('host'), function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://${app.get('host')}:${app.get('port')}`);
});
