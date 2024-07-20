import pool from "../pool.js";

// CREATE
export const createVendor = async (req, res) => {
  try {
    const { userId, name, address, phone, email, gstNo } = req.body;

    const [rows] = await pool.query(
      `INSERT INTO vendors (name, address, phone, email, gstNo) VALUES (?, ?, ?, ?, ?)`,
      [name, address, phone, email, gstNo]
    );

    const [rows2] = await pool.query(
      `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, "create", "vendors", "name", rows.insertId, "", name]
    );

    res.status(201).json({ id: rows.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getVendors = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM vendors");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// UPDATE
export const updateVendor = async (req, res) => {
  try {
    const { userId, name, address, phone, email, gstNo } = req.body;
    const vendorId = req.params.id;

    const prevRows = await pool.query(
      `SELECT name, address, phone, email, gstNo FROM vendors WHERE id = ?`,
      [vendorId]
    );
    const prevName = prevRows[0].name;
    const prevAddress = prevRows[0].address;
    const prevPhone = prevRows[0].phone;
    const prevEmail = prevRows[0].email;
    const prevGstNo = prevRows[0].gstNo;

    const [rows] = await pool.query(
      `UPDATE vendors SET name = ?, address = ?, phone = ?, email = ?, gstNo = ? WHERE id = ?`,
      [name, address, phone, email, gstNo, vendorId]
    );

    if (prevName !== name) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "vendors", "name", vendorId, prevName, name]
      );
    }
    if (prevAddress !== address) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "vendors", "address", vendorId, prevAddress, address]
      );
    }
    if (prevPhone !== phone) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "vendors", "phone", vendorId, prevPhone, phone]
      );
    }
    if (prevEmail !== email) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "vendors", "email", vendorId, prevEmail, email]
      );
    }
    if (prevGstNo !== gstNo) {
      const [rows2] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "update", "vendors", "gstNo", vendorId, prevGstNo, gstNo]
      );
    }

    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
