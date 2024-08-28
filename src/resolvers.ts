import { Resolvers } from "./generated/graphql.js";

import {
  insertUser,
  searchUserByEmail,
  searchUserByNumber,
  fetchAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
} from "./db/index.js";
import {
  checkIfValidEmail,
  checkIfValidName,
  checkIfValidPhoneNumber,
  checkIfValidUser,
  checkIfValidPaginationParams,
} from "./validators.js";

const resolvers: Resolvers = {
  Query: {
    async getUser(parent, { type, needle }, { user }) {
      if (checkIfValidUser(user)) {
        if (type === "email") {
          if (checkIfValidEmail(needle)) {
            return await searchUserByEmail(needle);
          }
        } else if (type === "phone_number") {
          if (checkIfValidPhoneNumber(needle)) {
            return await searchUserByNumber(needle);
          }
        }
      }
    },
    async getAll(parent, { limit, offset }, { user }) {
      if (
        checkIfValidUser(user) &&
        checkIfValidPaginationParams(limit, offset)
      ) {
        const users = await fetchAllUsers(limit, offset);
        const totalCount = await getUserCount();
        return {
          totalCount,
          users,
        };
      }
    },
  },
  User: {
    phoneNumber: (parent) => parent["phone_number"],
    createdAt: (parent) => parent["created_at"],
  },
  Mutation: {
    async createUser(
      parent,
      { input: { name, email, phoneNumber } },
      { user }
    ) {
      if (
        checkIfValidUser(user) &&
        checkIfValidName(name) &&
        checkIfValidEmail(email) &&
        checkIfValidPhoneNumber(phoneNumber)
      ) {
        await insertUser(email, name, phoneNumber);
        return await searchUserByEmail(email);
      }
    },
    async updateUser(
      parent,
      { input: { name, email, phoneNumber } },
      { user }
    ) {
      if (
        checkIfValidUser(user) &&
        checkIfValidName(name) &&
        checkIfValidEmail(email) &&
        checkIfValidPhoneNumber(phoneNumber)
      ) {
        await updateUser(email, name, phoneNumber);
        return await searchUserByEmail(email);
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
