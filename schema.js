const { readFileSync } = require("fs");
const typeDefs = readFileSync(__dirname + "/schema.gql", "utf8");
const resolvers = require("./resolvers");
module.exports = {
  typeDefs,
  resolvers
};
