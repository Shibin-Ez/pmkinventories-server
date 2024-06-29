import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DBHOST,
    port: 3306,
    user: process.env.USERNAME,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
  })
  .promise();

export default pool;