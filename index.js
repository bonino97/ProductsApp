import { ApolloServer } from 'apollo-server';

//////----Local Folders----/////
import { typeDefs } from './schema/schema.js';
import { resolvers } from './resolvers/resolvers.js';
import { dbConnect } from './config/db.js';
import { verifyToken } from './helpers/jwt.js';

dbConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    if (token) {
      try {
        const user = await verifyToken(token);
        return user;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    }
    return;
  },
});

server.listen().then(({ url }) => {
  console.log(`Server Running on: ${url}`);
});
