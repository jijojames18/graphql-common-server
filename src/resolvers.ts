import { Resolvers } from "./generated/graphql.js";

import { GraphQLError } from "graphql";

import {
  insertUser,
  searchUserByEmail,
  searchUserByNumber,
  fetchAllUsers,
  updateUser,
  deleteUser,
  queryUserByEmailAfterUpdate,
} from "./db/index.js";
import { INVALID_PARAM_CODE, INVALID_PARAM_MESSAGE } from "./constants.js";
import {
  checkIfValidEmail,
  checkIfValidName,
  checkIfValidPhoneNumber,
  checkIfValidUser,
} from "./validators.js";

const resolvers: Resolvers = {
  Query: {
    async users(parent, { type, needle }, { user }) {
      if (checkIfValidUser(user)) {
        if (!needle && !type) {
          return await fetchAllUsers();
        } else if (type === "email") {
          if (checkIfValidEmail(needle)) {
            return await searchUserByEmail(needle);
          }
        } else if (type === "phone_number") {
          if (checkIfValidPhoneNumber(needle)) {
            return await searchUserByNumber(needle);
          }
        } else if (type) {
          throw new GraphQLError(
            INVALID_PARAM_MESSAGE.replace("{PARAM}", "type"),
            {
              extensions: {
                code: INVALID_PARAM_CODE,
              },
            }
          );
        }

        return [];
      }
    },
  },
  User: {
    phoneNumber: (parent) => parent["phone_number"],
    createdAt: (parent) => parent["created_at"],
  },
  Mutation: {
    async createUser(parent, { name, email, phoneNumber }, { user }) {
      if (
        checkIfValidUser(user) &&
        checkIfValidName(name) &&
        checkIfValidEmail(email) &&
        checkIfValidPhoneNumber(phoneNumber)
      ) {
        await insertUser(email, name, phoneNumber);
        return await queryUserByEmailAfterUpdate(email);
      }
    },
    async updateUser(parent, { name, email, phoneNumber }, { user }) {
      if (
        checkIfValidUser(user) &&
        checkIfValidName(name) &&
        checkIfValidEmail(email) &&
        checkIfValidPhoneNumber(phoneNumber)
      ) {
        await updateUser(email, name, phoneNumber);
        return await queryUserByEmailAfterUpdate(email);
      }
    },
    async deleteUser(parent, { email }, { user }) {
      if (checkIfValidUser(user) && checkIfValidEmail(email)) {
        await deleteUser(email);
        return true;
      }
    },
  },
};

export { resolvers };
