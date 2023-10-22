import pool from "../pool.js";

// CREATE
export const createCategory = async (req, res) => {
  try {
    // const userId = parseInt(req.params.id);
    const { userId, name } = req.body;
    console.log(req.body);
    const [rows] = await pool.query(
      `INSERT INTO categories (name) VALUES (?)`,
      [name]
    );

    const [rows2] = await pool.query(
      `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, "create", "categories", "name", rows.insertId, "", name]
    );

    res.status(201).json({ id: rows.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getCategories = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM categories");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const categoryId = req.params.id;
    if (categoryId == 1 || categoryId == 2) {
      res.status(403).send("Updating default category not allowed");
      return;
    }

    const prevRows = await pool.query(
      `SELECT name FROM categories WHERE id = ?`,
      [categoryId]
    );
    const prevName = prevRows[0].name;

    const [rows] = await pool.query(
      `UPDATE categories SET name = ? WHERE id = ?`,
      [name, categoryId]
    );

    const [rows2] = await pool.query(
      `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, "update", "categories", "name", rows.insertId, prevName, name]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, name } = req.body;
    const [rows] = await pool.query(`DELETE FROM categories WHERE id = ?`, [
      id,
    ]);

    if (id == 1) {
      // forbidden
      res.status(403).send("Cannot delete default category");
      return;
    }

    const [rows2] = await pool.query(
      `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, "delete", "categories", "name", rows.insertId, name, ""]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
