import mysql, { QueryResult } from "mysql2/promise";
import dotenv from "dotenv";
import { GraphQLError } from "graphql";

import { ERROR_IN_QUERY_CODE, ERROR_IN_QUERY_MESSAGE } from "../constants.js";
import { UserEntity } from "../types.js";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
});

export async function executeQuery(
  query: string,
  params: Array<string | number> = []
) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (err) {
    throw new GraphQLError(ERROR_IN_QUERY_MESSAGE, {
      extensions: {
        code: ERROR_IN_QUERY_CODE,
      },
    });
  }
}

export async function searchUserByEmail(needle: string) {
  const query = `
      SELECT * FROM User
      WHERE email = ?
    `;
  return (await executeQuery(query, [needle])) as Array<UserEntity>;
}

export async function searchUserByNumber(needle: string) {
  const query = `
      SELECT * FROM User
      WHERE phone_number = ?
    `;
  return (await executeQuery(query, [needle])) as Array<UserEntity>;
}

export async function fetchAllUsers() {
  const query = `
      SELECT * FROM User
    `;
  return (await executeQuery(query)) as Array<UserEntity>;
}

export async function insertUser(
  email: string,
  name: string,
  phoneNumber: string
): Promise<QueryResult> {
  const query = `
      INSERT INTO User (name, email, phone_number, created_at)
      VALUES (?, ?, ?, ?)
    `;
  const epochTimeInSeconds = Math.floor(Date.now() / 1000);
  return await executeQuery(query, [
    name,
    email,
    phoneNumber,
    epochTimeInSeconds,
  ]);
}

export async function updateUser(
  email: string,
  name: string,
  phoneNumber: string
): Promise<QueryResult> {
  const query = `
      UPDATE User
      SET name = ?, phone_number = ?
      WHERE email = ?
    `;
  return await executeQuery(query, [name, phoneNumber, email]);
}

export async function deleteUser(email: string): Promise<QueryResult> {
  const query = `
      DELETE FROM User
      WHERE email = ?
    `;
  return await executeQuery(query, [email]);
}

export async function queryUserByEmailAfterUpdate(email: string) {
  const queryResult = await searchUserByEmail(email);
  return queryResult[0];
}
