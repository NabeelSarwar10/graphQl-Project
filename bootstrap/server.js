import http from 'http';
import express from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "../schemas";
import resolvers from "../resolvers/index";

export default (db) => {
  const server = new ApolloServer({ typeDefs, resolvers: resolvers(db)});

  const app = express();
  server.applyMiddleware({ app });

  const port = process.env.PORT;
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
};
