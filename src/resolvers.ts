import {
  insertUser,
  searchUserByEmail,
  searchUserByNumber,
  fetchAllUsers,
  updateUser,
  deleteUser,
  queryUserByEmailAfterUpdate,
} from "./db/index.js";

const checkIfValidUser = (user) => {
  if (!user) {
    throw new Error("Unauthorized");
  }
  return true;
};

const resolvers = {
  Query: {
    async users(parent, { type, needle }, { user }) {
      if (checkIfValidUser(user)) {
        if (!needle && !type) {
          return await fetchAllUsers();
        } else if (type === "email") {
          return await searchUserByEmail(needle);
        } else if (type === "phone_number") {
          return await searchUserByNumber(needle);
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
      if (checkIfValidUser(user)) {
        await insertUser(email, name, phoneNumber);
        return await queryUserByEmailAfterUpdate(email);
      }
    },
    async updateUser(parent, { name, email, phoneNumber }, { user }) {
      if (checkIfValidUser(user)) {
        await updateUser(email, name, phoneNumber);
        return await queryUserByEmailAfterUpdate(email);
      }
    },
    async deleteUser(parent, { email }, { user }) {
      if (checkIfValidUser(user)) {
        await deleteUser(email);
        return true;
      }
    },
  },
};

export { resolvers };
