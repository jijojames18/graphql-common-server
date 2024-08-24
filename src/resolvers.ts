import {
  insertUser,
  searchUserByEmail,
  searchUserByNumber,
  fetchAllUsers,
  updateUser,
  deleteUser,
  queryUserByEmailAfterUpdate,
} from "./db/index.js";

const resolvers = {
  Query: {
    async users(parent, { type, needle }) {
      if (!needle && !type) {
        return await fetchAllUsers();
      } else if (type === "email") {
        return await searchUserByEmail(needle);
      } else if (type === "phone_number") {
        return await searchUserByNumber(needle);
      }

      return [];
    },
  },
  User: {
    phoneNumber: (parent) => parent["phone_number"],
    createdAt: (parent) => parent["created_at"],
  },
  Mutation: {
    async createUser(parent, { name, email, phoneNumber }) {
      await insertUser(email, name, phoneNumber);
      return await queryUserByEmailAfterUpdate(email);
    },
    async updateUser(parent, { name, email, phoneNumber }) {
      await updateUser(email, name, phoneNumber);
      return await queryUserByEmailAfterUpdate(email);
    },
    async deleteUser(parent, { email }) {
      await deleteUser(email);
      return true;
    },
  },
};

export { resolvers };
