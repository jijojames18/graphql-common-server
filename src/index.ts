import express from "express";
import cors from "cors";

import { ApolloServer } from "apollo-server-express";
import { readFileSync } from "fs";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import { resolvers } from "./resolvers.js";

const PORT = process.env.PORT || 5050;
const JWT_SECRET = Buffer.from(process.env.SECRET, "base64");
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  expressjwt({
    algorithms: ["HS256"],
    credentialsRequired: false,
    secret: JWT_SECRET,
  })
);

app.post("/login", async (req, res) => {
  // In implementing project, validate the details here
  // const { email, password } = req.body;
  const token = jwt.sign({ sub: "user" }, JWT_SECRET);
  res.json({ token });
  //res.sendStatus(401);
});

const typeDefs = readFileSync("./src/schema.graphql", {
  encoding: "utf-8",
});

const context = async ({ req }) => {
  if (req.auth) {
    const user = {
      user: req.auth.sub,
    };
    return { user };
  }
  return {};
};

const server = new ApolloServer({ typeDefs, resolvers, context });

await server.start();

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
