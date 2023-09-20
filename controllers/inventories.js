import pool from "../pool.js";

// CREATE
export const createInventory = async (req, res) => {
  try {
    const { name, unit } = req.body;
    if(name) {
      const [rows, fields] = await pool.query(
        `INSERT INTO inventories (name, unit) VALUES (?, ?)`,
        [name, unit]
      );
      res.status(201).json({ id: rows.insertId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getInventories = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM inventories");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getInventory = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM inventories WHERE id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getInventoriesForSite = async (req, res) => {
  try {
    const userId = req.params.id;
    const [users] = await pool.query(
      "SELECT siteId FROM users where id = ?",
      [userId]
    );
    const siteId = users[0].siteId;
    const [allInventories] = await pool.query("SELECT * FROM inventories");
    const [stocks] = await pool.query(
      "SELECT inventoryId, available, serviceable, scrapped FROM stocks WHERE siteId = ?",
      [siteId]
    );
    const inventories = [];
    for (const inventory of allInventories) {
      let isPresent = 0;
      for (const stock of stocks) {
        if (inventory.id == stock.inventoryId) {
          isPresent = 1;
          inventory.available = stock.available;
          inventory.serviceable = stock.serviceable;
          inventory.scrapped = stock.scrapped;
          inventory.total = stock.available + stock.serviceable + stock.scrapped;
          break;
        }
      }
      if (!isPresent){
        inventory.available = 0;
        inventory.serviceable = 0;
        inventory.scrapped = 0;
        inventory.total = 0;
        inventories.push(inventory);
      } else {
        inventories.push(inventory);
      }
    }
    res.status(200).json(inventories);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// UPDATE
export const updateInventory = async (req, res) => {
  try {
    const [name, unit] = req.body;
    const [rows, fields] = await pool.query(
      `UPDATE Inventories SET name = ?, unit = ? WHERE id = ?`,
      [name, unit, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// DELETE
export const deleteInventory = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `DELETE FROM Inventories WHERE id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
