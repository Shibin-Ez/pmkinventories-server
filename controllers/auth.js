import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../pool.js";

// REGISTER USER
export const registerInitiate = async (req, res) => {
  try {
    const { name, role, siteId, mobileNo, email } = req.body;
    const [rows, fields] = await pool.query(
      `INSERT INTO users (name, role, siteId, mobileNo, email) VALUES (?, ?, ?, ?, ?)`,
      [name, role, siteId, mobileNo, email]
    );
    res.status(200).json({ id: rows.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;
    console.log(req.body);
    const [rows, fields] = await pool.query(
      `SELECT id, name, passwordHash, userRole FROM users WHERE mobileNo = ?`,
      [mobileNo]
    );
    const passwordHash = rows[0].passwordHash.split("$")[1];
    const isMatch = passwordHash === password;
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    res
      .status(200)
      .json({ id: rows[0].id, userRole: rows[0].userRole, name: rows[0].name });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
