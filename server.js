"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const MyGraphQLSchema = require("./schema/schema");
require("dotenv").config;
const db = require("./db/db");
const port = 3000;
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
  })
);

db.on('connected', () => {
  app.listen(port, () => console.log(`App on port ${port}`));
});

