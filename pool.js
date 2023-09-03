import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const pool = mysql
  .createPool({
    host: "testdb.camp9fj7olyc.eu-north-1.rds.amazonaws.com",
    user: "admin",
    password: "adb15234",
    database: "testdb",
  })
  .promise();

export default pool;