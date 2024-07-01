import pool from "../pool.js";

// CREATE
export const createExchange = async (req, res) => {
  try {
    const { fromStockId, toStockId, quantity, date } = req.body;
    const [rows, fields] = await pool.query(
      `INSERT INTO exchanges (fromStockId, toStockId, quantity, date) VALUES (?, ?, ?, ?)`,
      [fromStockId, toStockId, quantity, date]
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getExchanges = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM exchanges");
    if (rows.length === 0) {
      console.log("zero exchanges so far");
      res.status(404).send("Zero Exchanges So Far");
    }

    const [stocks] = await pool.query(`SELECT id, siteId, inventoryId FROM stocks`);
    const [inventories] = await pool.query("SELECT id, name FROM inventories");
    const [sites] = await pool.query("SELECT name FROM sites");

    const reverseRows = rows.reverse();
    const modifiedRows = [];
    for (const row of reverseRows) {
      const {
        id,
        fromStockId,
        toStockId,
        available,
        serviceable,
        scrapped,
        remark,
        prevAvailable,
        prevServiceable,
        prevScrapped,
        timestamp,
      } = row;

      let currentStock = {};
      for (const stock of stocks) {
        if (stock.id === fromStockId) {
          currentStock = stock;
        }
      }

      let currentInventory = {};
      for (const inventory of inventories) {
        if (currentStock.inventoryId === inventory.id) {
          currentInventory = inventory;
        }
      }

      let currentSite = {};
      for (const site of sites) {
        if (currentStock.siteId == site.id) {
          currentSite = site;
        }
      }

      modifiedRows.push({
        id,
        fromStockId,
        toStockId,
        inventoryName: currentInventory.name,
        siteName: currentSite.name,
        available,
        serviceable,
        scrapped,
        remark,
        prevAvailable,
        prevServiceable,
        prevScrapped,
        timestamp,
      });
    }
    res.status(200).json(modifiedRows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getExchange = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM exchanges WHERE id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getLastFewExchanges = async (req, res) => {
  try {
    const limit = req.body.limit ? req.body.limit : 10;
    const [rows, fields] = await pool.query(
      `SELECT * FROM exchanges ORDER BY id DESC LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getCrudLogs = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM crudLogs ORDER BY id DESC`,
      ["exchanges"]
    );
    const [users] = await pool.query(`SELECT id, name, userId FROM users`);

    for (const row of rows) {
      for (const user of users) {
        if (user.id === row.userId) {
          row.userName = user.name;
          row.userID = user.userId;
        }
      }
    }

    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
