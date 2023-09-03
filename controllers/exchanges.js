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
    res.status(200).json(rows);
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

