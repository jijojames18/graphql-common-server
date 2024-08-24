import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create DB pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
});

export async function executeQuery(query, params = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}

export async function searchUserByEmail(needle) {
  const query = `
      SELECT * FROM User
      WHERE email = ?
    `;
  return await executeQuery(query, [needle]);
}

export async function searchUserByNumber(needle) {
  const query = `
      SELECT * FROM User
      WHERE phone_number = ?
    `;
  return await executeQuery(query, [needle]);
}

export async function fetchAllUsers() {
  const query = `
      SELECT * FROM User
    `;
  return await executeQuery(query);
}

export async function insertUser(email, name, phoneNumber) {
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

export async function updateUser(email, name, phoneNumber) {
  const query = `
      UPDATE User
      SET name = ?, phone_number = ?
      WHERE email = ?
    `;
  return await executeQuery(query, [name, phoneNumber, email]);
}

export async function deleteUser(email) {
  const query = `
      DELETE FROM User
      WHERE email = ?
    `;
  return await executeQuery(query, [email]);
}

export async function queryUserByEmailAfterUpdate(email) {
  const queryResult = await searchUserByEmail(email);
  return queryResult[0];
}
