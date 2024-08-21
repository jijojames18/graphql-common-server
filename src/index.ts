import { executeQuery } from "./db/index.js";

async function run() {
  try {
    const results = await executeQuery("SELECT * FROM User");
    console.log("User data:", results);
  } catch (err) {
    console.error("Error executing query:", err);
  }
}

run();
