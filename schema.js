const { readFileSync } = require("fs");
const typeDefs = readFileSync(__dirname + "/typeDefs.gql", "utf8");
const resolvers = require("./resolvers");
module.exports = {
  typeDefs,
  resolvers
};
