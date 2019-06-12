const { GraphQLServer } = require("graphql-yoga");
const db = require("./database");
const { typeDefs, resolvers } = require("./schema");
const options = {
  port: process.env.PORT || 4000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

async function main() {
  try {
    await db.open();
    const server = new GraphQLServer({ typeDefs, resolvers });
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
