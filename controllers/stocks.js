import pool from "../pool.js";

// CREATE
export const createStock = async (req, res) => {
  try {
    const userId = req.params.id;
    const { inventoryId, available, serviceable, scrapped } = req.body;
    const [siteIds] = await pool.query(
      `SELECT siteId FROM users WHERE id = ?`,
      [userId]
    );
    const siteId = siteIds[0].siteId;

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
      res.status(201).json({
        id: isCreated[0].id,
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
      res
        .status(201)
        .json({
          id: rows.insertId,
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
