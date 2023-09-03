import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DBHOST,
    user: process.env.USER,
    password: process.env.DBPASS,
    database: "testdb",
  })
  .promise();

export default pool;