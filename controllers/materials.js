import pool from "../pool.js";

// CREATE
export const createMaterial = async (req, res) => {
  try {
    const { userId, name, unit, gstPercent, categoryId } = req.body;

    const [rows] = await pool.query(
      `INSERT INTO materials (name, unit, gstPercent, categoryId) VALUES (?, ?, ?, ?)`,
      [name, unit, gstPercent, categoryId]
    );

    const [rows2] = await pool.query(
      `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, "create", "materials", "name", rows.insertId, "", name]
    );

    res.status(201).json({ id: rows.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getMaterials = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM materials");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// UPDATE
export const updateMaterial = async (req, res) => {
  try {
    const { userId, name, unit, gstPercent, categoryId } = req.body;
    const materialId = req.params.id;

    const prevRows = await pool.query(
      `SELECT name, unit, gstPercent, categoryId FROM materials WHERE id = ?`,
      [materialId]
    );
    const prevName = prevRows[0].name;
    const prevUnit = prevRows[0].unit;
    const prevGstPercent = prevRows[0].gstPercent;
    const prevCategoryId = prevRows[0].categoryId;

    const [rows] = await pool.query(
      `UPDATE materials SET name = ?, unit = ?, gstPercent = ?, categoryId = ? WHERE id = ?`,
      [name, unit, gstPercent, categoryId, materialId]
    );

    if (prevName !== name) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "materials", "name", materialId, prevName, name]
      );
    }
    if (prevUnit !== unit) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "materials", "unit", materialId, prevUnit, unit]
      );
    }
    if (prevGstPercent !== gstPercent) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "materials", "gstPercent", materialId, prevGstPercent, gstPercent]
      );
    }
    if (prevCategoryId !== categoryId) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "materials", "categoryId", materialId, prevCategoryId, categoryId]
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};