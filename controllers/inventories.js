import pool from "../pool.js";
import PDFDocument from "pdfkit-table";
import fs from "fs";

// CREATE
export const createInventory = async (req, res) => {
  try {
    const { name, unit } = req.body;
    if (name) {
      const [rows, fields] = await pool.query(
        `INSERT INTO inventories (name, unit) VALUES (?, ?)`,
        [name, unit]
      );

      const [rows2] = await pool.query(
        `UPDATE inventories SET inventoryId = 1000+id`
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
    const [users] = await pool.query("SELECT siteId FROM users where id = ?", [
      userId,
    ]);
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
          inventory.total =
            stock.available + stock.serviceable + stock.scrapped;
          break;
        }
      }
      if (!isPresent) {
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

export const downloadInventoryPdf = async (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const filename = 'inventories_list.pdf';
    const pdfStream = doc.pipe(fs.createWriteStream(filename));

    // PDF metadata
    doc.info['Title'] = 'Inventories';

    // Fetch data from the database
    const [rows] = await pool.query('SELECT * FROM inventories');

    // Create table data
    let count=1;
    const table = {
      title: 'Inventories',
      headers: [
        { label:"Sl.No", property: 'slNo', width: 50, renderer: null },
        { label:"Inventory Id", property: 'id', width: 50, renderer: null },
        { label:"Inventory Name", property: 'name', width: 150, renderer: null },
      ],
      rows: rows.map((row) => [count++, row.inventoryId, row.name]),
    };

    // Calculate the horizontal center position for the table
    const pageWidth = doc.page.width;
    const tableWidth = 250; // Assuming each column is 100 units wide
    const centerX = (pageWidth - tableWidth) / 2;

    // Center the table horizontally on the page
    doc.table(table, {
      width: tableWidth,
      x: centerX,
    });

    // Respond to the request with the PDF as a download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe the PDF stream to the response
    pdfStream.on('finish', () => {
      fs.createReadStream(filename).pipe(res);
    });

    // End the PDF creation
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Something broke!');
  }
};

// UPDATE
export const updateInventory = async (req, res) => {
  try {
    const { name, unit } = req.body;
    const [rows, fields] = await pool.query(
      `UPDATE inventories SET name = ?, unit = ? WHERE id = ?`,
      [name, unit, req.params.id]
    );
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// DELETE
export const deleteInventory = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `DELETE FROM inventories WHERE id = ?`,
      [req.params.id]
    );
    res.json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
