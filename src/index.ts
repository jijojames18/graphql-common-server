import express from "express";
import cors from "cors";

import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";

import { resolvers } from "./resolvers.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const typeDefs = gql(
  readFileSync("./src/schema.graphql", {
    encoding: "utf-8",
  })
);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

await server.start();

app.use("/graphql", cors(), express.json(), expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
