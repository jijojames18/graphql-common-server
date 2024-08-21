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
    const [rows, fields] = await pool.execute(query, params);
    return rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}
