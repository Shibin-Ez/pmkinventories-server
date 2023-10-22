import pool from "../pool.js";

// CREATE
export const createStock = async (req, res) => {
  try {
    const userId = req.params.id;
    const { inventoryId, available, serviceable, scrapped, remark } = req.body;
    const [siteIds] = await pool.query(
      `SELECT siteId FROM users WHERE id = ?`,
      [userId]
    );
    const siteId = siteIds[0].siteId;
    console.log(siteId);

    const [isCreated] = await pool.query(
      `SELECT * FROM stocks WHERE siteId = ? AND inventoryId = ?`,
      [siteId, inventoryId]
    );

    const [inventoryName] = await pool.query(
      `SELECT name FROM inventories WHERE id = ?`,
      [inventoryId]
    );

    if (isCreated.length > 0) {
      // updation
      const [rows, fields] = await pool.query(
        `UPDATE stocks SET available = ?, serviceable = ?, scrapped = ? WHERE siteId = ? AND inventoryId = ?`,
        [available, serviceable, scrapped, siteId, inventoryId]
      );
      const [rows2] = await pool.query(
        `INSERT INTO exchanges (fromStockId, toStockId, available, serviceable, scrapped, remark, prevAvailable, prevServiceable, prevScrapped) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          isCreated[0].id,
          isCreated[0].id,
          available,
          serviceable,
          scrapped,
          remark,
          isCreated[0].available,
          isCreated[0].serviceable,
          isCreated[0].scrapped,
        ]
      );

      const [prevRowUpdate] = await pool.query(
        `UPDATE prevStocks SET available = ?, serviceable = ?, scrapped = ? WHERE siteId = ? AND inventoryId = ?`,
        [
          isCreated[0].available,
          isCreated[0].serviceable,
          isCreated[0].scrapped,
          siteId,
          inventoryId,
        ]
      );
      res.status(201).json({
        id: inventoryId,
        name: inventoryName[0].name,
        available,
        serviceable,
        scrapped,
        total: available + serviceable + scrapped,
      });
    } else {
      //creation
      const [rows, fields] = await pool.query(
        `INSERT INTO stocks (siteId, inventoryId, available, serviceable, scrapped) VALUES (?, ?, ?, ?, ?)`,
        [siteId, inventoryId, available, serviceable, scrapped]
      );
      const [rows2] = await pool.query(
        `INSERT INTO exchanges (fromStockId, toStockId, available, serviceable, scrapped, remark, prevAvailable, prevServiceable, prevScrapped) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          rows.insertId,
          rows.insertId,
          available,
          serviceable,
          scrapped,
          remark,
          0,
          0,
          0,
        ]
      );
      const [rows3] = await pool.query(
        `INSERT INTO prevStocks (siteId, inventoryId, available, serviceable, scrapped) VALUES (?, ?, ?, ?, ?)`,
        [siteId, inventoryId, 0, 0, 0]
      );
      res.status(201).json({
        id: inventoryId,
        name: inventoryName[0].name,
        available,
        serviceable,
        scrapped,
        total: available + serviceable + scrapped,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const createInitialStocks = async (req, res) => {
  try {
    const stocks = req.body;
    stocks.forEach((stock) => {
      const { siteId, inventoryId, available, serviceable, scrapped } = stock;
      pool.query(
        `INSERT INTO stocks (siteId, inventoryId, available, serviceable, scrapped) VALUES (?, ?, ?, ?, ?)`,
        [siteId, inventoryId, available, serviceable, scrapped]
      );
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getStocks = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM stocks");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getStock = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM stocks WHERE id = ?`,
      [req.params.id]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getStocksBySites = async (req, res) => {
  try {
    const report = [];
    const [sites] = await pool.query("SELECT id, name FROM sites");
    for (const site of sites) {
      const stocks = await getStocksBySite(site.id);
      if (stocks.length > 0)
        report.push({ siteName: site.name, stocks: stocks });
    }
    res.status(200).json(report);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getStocksBySite = async (id) => {
  const [rows, fields] = await pool.query(
    `SELECT * FROM stocks WHERE siteId = ?`,
    [id]
  );
  for (const row of rows) {
    const [inventory] = await pool.query(
      `SELECT name FROM inventories WHERE id = ?`,
      [row.inventoryId]
    );
    row.inventoryName = inventory[0].name;
  }
  return rows;
};

export const getStocksByInventory = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM stocks WHERE inventoryId = ?`,
      [req.params.inventoryId]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// UPDATE
export const updateStock = async (req, res) => {
  try {
    const { siteId, inventoryId, available, serviceable, scrapped } = req.body;
    const [rows, fields] = await pool.query(
      `UPDATE stocks SET siteId = ?, inventoryId = ?, available = ?, serviceable = ?, scrapped = ?, WHERE id = ?`,
      [siteId, inventoryId, available, serviceable, scrapped, req.params.id]
    );
    res.status(200).json({ id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const updateItemStates = async (req, res) => {
  try {
    const [rowsPrev] = await pool.query(
      `SELECT available, serviceable, scrapped FROM stocks WHERE id = ?`,
      [req.params.id]
    );
    const prevAvailable = rowsPrev[0].available;
    const prevServiceable = rowsPrev[0].serviceable;
    const prevScrapped = rowsPrev[0].scrapped;

    const { available, serviceable, scrapped } = req.body;

    if (
      prevAvailable + prevServiceable + prevScrapped !==
      available + serviceable + scrapped
    ) {
      res.status(400).send("not allowed to change total count!");
      return;
    }

    const [rows, fields] = await pool.query(
      `UPDATE stocks SET available = ?, serviceable = ?, scrapped = ? WHERE id = ?`,
      [available, serviceable, scrapped, req.params.id]
    );
    res.status(200).json({ id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const rollback = async (req, res) => {
  try {
    const { userId } = req.body;
    const [rows0] = await pool.query(
      `SELECT siteId FROM users WHERE id = ?`,
      [userId]
    );
    const [names] = await pool.query(
      `SELECT name FROM inventories WHERE id = ?`,
      [req.params.id]
    );
    const [rows] = await pool.query(
      `SELECT id, available, serviceable, scrapped FROM prevStocks WHERE siteId = ? AND inventoryId = ?`,
      [rows0[0].siteId, req.params.id]
    );
    console.log(rows);
    const [stockRows] = await pool.query(
      `SELECT available, serviceable, scrapped FROM stocks WHERE id = ?`,
      [rows[0].id]
    );
    console.log(stockRows);

    if (
      rows[0].available == stockRows[0].available &&
      rows[0].serviceable == stockRows[0].serviceable &&
      rows[0].scrapped == stockRows[0].scrapped
    ) {
      res.status(400).json({ status: "already rolled back" });
      return;
    }

    const [rows2, fields] = await pool.query(
      `UPDATE stocks SET available = ?, serviceable = ?, scrapped = ? WHERE id = ?`,
      [rows[0].available, rows[0].serviceable, rows[0].scrapped, rows[0].id]
    );
    const [rows3] = await pool.query(
      `INSERT INTO exchanges (fromStockId, toStockId, available, serviceable, scrapped, remark, prevAvailable, prevServiceable, prevScrapped) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rows[0].id,
        rows[0].id,
        rows[0].available,
        rows[0].serviceable,
        rows[0].scrapped,
        "--rollback--",
        stockRows[0].available,
        stockRows[0].serviceable,
        stockRows[0].scrapped,
      ]
    );
    res.status(200).json({
      available: rows[0].available,
      serviceable: rows[0].serviceable,
      scrapped: rows[0].scrapped,
      total: rows[0].available + rows[0].serviceable + rows[0].scrapped,
      id: req.params.id,
      name: names[0].name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
