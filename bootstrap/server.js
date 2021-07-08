import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "../schemas";
import resolvers from "../resolvers/index";
import expressJwt from "express-jwt";

export default (db) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers(db),
    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    },
  });

  const app = express();
  app.use(
    expressJwt({
      secret: process.env.JWT_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );
  server.applyMiddleware({ app });

  const port = process.env.PORT;
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
};
