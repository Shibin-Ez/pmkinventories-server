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
      const [data] = await pool.query(
        `SELECT siteId, inventoryId FROM stocks WHERE id = ?`,
        [fromStockId]
      );
      console.log(data);
      // console.log(data[0].inventoryId);
      const [data2] = await pool.query(
        `SELECT name FROM inventories WHERE id = ?`,
        [data[0].inventoryId]
      );
      console.log(data2);
      const [data3] = await pool.query(`SELECT name FROM sites WHERE id = ?`, [
        data[0].siteId,
      ]);
      modifiedRows.push({
        id,
        fromStockId,
        toStockId,
        inventoryName: data2[0].name,
        siteName: data3[0].name,
        available,
        serviceable,
        scrapped,
        remark,
        prevAvailable,
        prevServiceable,
        prevScrapped,
        timestamp,
      });
    };
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