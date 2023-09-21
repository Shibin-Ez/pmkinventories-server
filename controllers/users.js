import pool from "../pool.js";

// CREATE
export const createUser = async (req, res) => {
  try {
    const { userRole, name, siteId, mobileNo, email } = req.body;
    console.log(req.body);
    if (userRole && name) {
      const otp = "$" + Math.floor(1000 + Math.random() * 8900);
      const [rows0] = await pool.query(
        `SELECT COUNT(*) AS rowCount
        FROM users
        WHERE userRole = ?`,
        [userRole]
      );
      console.log(rows0);
      let userId = rows0[0].rowCount + 1;
      switch (userRole) {
        case "director":
          userId = 10000 + userId;
          break;
        case "manager":
          userId = 20000 + userId;
          break;
        case "admin":
          userId = 30000 + userId;
          break;
        case "user":
          userId = 40000 + userId;
          break;
      }
      let sites = [];
      if (siteId) {
        [sites] = await pool.query(`SELECT name FROM sites WHERE id = ?`, [
          siteId,
        ]);
      }
      const siteName = sites[0].name;
      const [rows, fields] = await pool.query(
        `INSERT INTO users (userRole, name, userId, siteId, siteName, mobileNo, email, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userRole, name, userId, siteId, siteName, mobileNo, email, otp]
      );
      const link =
        "https://drive.google.com/uc?export=download&id=1-wPX3gOYfOC2z8pe7RAYSx3mc8ZeINDO";
      res
        .status(201)
        .json({ ...req.body, link, userId, passwordHash: otp.split("$")[1] });
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
    let sites = [];
      if (siteId) {
        [sites] = await pool.query(`SELECT name FROM sites WHERE id = ?`, [
          siteId,
        ]);
      }
      const siteName = sites[0].name;
    if (userRole && name) {
      const [rows, fields] = await pool.query(
        `UPDATE users SET userRole = ?, name = ?, siteId = ?, siteName = ?, mobileNo = ?, email = ? WHERE id = ?`,
        [userRole, name, siteId, siteName, mobileNo, email, req.params.id]
      );
      res.json({ id: rows.insertId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
