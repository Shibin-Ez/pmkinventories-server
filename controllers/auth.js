import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../pool.js";
import latestVersion from "../data/version.js";

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
    const { userId, password } = req.body;
    console.log(req.body);
    const [rows, fields] = await pool.query(
      `SELECT id, name, passwordHash, userRole FROM users WHERE userId = ?`,
      [userId]
    );
    if (rows.length === 0) return res.status(400).json({ msg: "Invalid User" });
    const isFirstLogin = rows[0].passwordHash.length === 5;
    console.log(isFirstLogin);
    const passwordHash = isFirstLogin
      ? rows[0].passwordHash.split("$")[1]
      : rows[0].passwordHash;
    const isMatch = isFirstLogin
      ? passwordHash === password
      : await bcrypt.compare(password, passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    res.status(200).json({
      id: rows[0].id,
      userRole: rows[0].userRole,
      name: rows[0].name,
      isFirstLogin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    console.log(id + " " + password);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    // console.log(passwordHash);
    const [rows, fields] = await pool.query(
      `UPDATE users SET passwordHash = ? WHERE id = ?`,
      [passwordHash, id]
    );
    console.log(rows);
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const otp = "$" + Math.floor(1000 + Math.random() * 8999);
    const [rows, fields] = await pool.query(
      `UPDATE users SET passwordHash = ? WHERE id = ?`,
      [otp, userId]
    );
    res.status(200).json({ passwordHash: otp.split("$")[1] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
