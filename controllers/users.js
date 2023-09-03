import pool from "../pool.js";

// CREATE
export const createUser = async (req, res) => {
  try {
    const { userRole, name, siteId, mobileNo, email } = req.body;
    console.log(req.body);
    if (userRole && name) {
      const otp = "$" + Math.floor(1000 + Math.random() * 8900);
      const [rows, fields] = await pool.query(
        `INSERT INTO users (userRole, name, siteId, mobileNo, email, passwordHash) VALUES (?, ?, ?, ?, ?, ?)`,
        [userRole, name, siteId, mobileNo, email, otp]
      );
      res.status(201).json({ ...req.body, passwordHash: otp.split("$")[1] });
    } else {
      res.status(409).json({ message: "Please provide userRole and name" });
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
    console.log(err);
  }
};

// READ
export const getUsers = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getUser = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// UPDATE
export const updateUser = async (req, res) => {
  try {
    const { userRole, name, siteId, mobileNo, email } = req.body;
    console.log("get body");
    console.log(req.body);
    if (userRole && name) {
      const [rows, fields] = await pool.query(
        `UPDATE users SET userRole = ?, name = ?, siteId = ?, mobileNo = ?, email = ? WHERE id = ?`,
        [userRole, name, siteId, mobileNo, email, req.params.id]
      );
      res.json({ id: rows.insertId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
