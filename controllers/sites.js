import pool from "../pool.js";

// CREATE
export const createSite = async (req, res) => {
  try {
    const { name, siteType, address, latitude, longitude } = req.body;
    if (name && siteType) {
      const [rows, fields] = await pool.query(
        `INSERT INTO sites (name, siteType, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)`,
        [name, siteType, address, latitude, longitude]
      );
      res.status(201).json({ id: rows.insertId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getSites = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM sites");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getSite = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM sites WHERE id = ${req.params.id}`
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// UPDATE
export const updateSite = async (req, res) => {
  try {
    const { name, siteType, address, latitude, longitude } = req.body;
    console.log(req.body);
    if (name && siteType) {
      const [rows, fields] = await pool.query(
        `UPDATE sites SET name = ?, siteType = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?`,
        [name, siteType, address, latitude, longitude, req.params.id]
      );
      res.status(201).json({ id: rows.insertId});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// DELETE
export const deleteSite = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(`DELETE FROM sites WHERE id = ?`, [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
