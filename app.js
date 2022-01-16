"use strict";
const graphql = require("graphql");
const bodyParser = require('body-parser');
const express = require("express");
const expressGraphQl = require("express-graphql").graphqlHTTP;
const { GraphQLSchema } = graphql;
const { query } = require("./schemas/queries");
const { mutation } = require("./schemas/mutations");

const APP_PORT = 4999;

var app = express();

const schema = new GraphQLSchema({
  query,
  mutation
});


app.use('/', bodyParser.json(), expressGraphQl({
    schema: schema,    
    graphiql: true
  })
);

app.listen(APP_PORT, () =>
  console.log('GraphQL server running on localhost:4999')
);