const express = require("express");
const graphqlHTTP = require("express-graphql");
const rootValue = require("./resolvers");
const port = process.env.PORT || 4000;
const { buildSchema } = require("graphql");
const { readFileSync } = require("fs");
const db = require("./database");

let schema = readFileSync(__dirname + "/schema.gql", "utf8");
schema = buildSchema(schema);

async function main() {
  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue,
      graphiql: true
    })
  );

  try {
    await db.open();
    app.listen(port);
    console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
