import pool from "../pool.js";
import PDFDocument from "pdfkit-table";
import fs from "fs";
import getLocalDate from "../functions/getLocalDate.js";

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

// report
export const getStockSitewise = async () => {
  try {
    const report = [];
    const [sites] = await pool.query("SELECT id, name FROM sites");
    const [stocks] = await pool.query("SELECT * FROM stocks");
    const [inventories] = await pool.query("SELECT * FROM inventories");
    for (const site of sites) {
      const stocksForSite = [];
      for (const stock of stocks) {
        if (stock.siteId === site.id) {
          for (const inventory of inventories) {
            if (inventory.id === stock.inventoryId) {
              stock.inventoryName = inventory.name;
              break;
            }
          }

          const sum = stock.available + stock.serviceable + stock.scrapped;
          if (sum > 0) stocksForSite.push(stock);
        }
      }

      // const stocks = await getStocksBySite(site.id);
      if (stocksForSite.length > 0)
        report.push({ siteName: site.name, stocks: stocksForSite });
    }
    // res.status(200).json(report);
    return report;
  } catch (err) {
    console.log(err);
    // res.status(500).send("Something broke!");
    return;
  }
};

export const getStocksBySites = async (req, res) => {
  try {
    const report = await getStockSitewise();
    res.status(200).json(report);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getStocksBySite = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM stocks WHERE siteId = ?`,
      [req.params.id]
    );
    const [inventories] = await pool.query("SELECT * FROM inventories");
    const stocks = [];
    for (const row of rows) {
      const sum = row.available + row.serviceable + row.scrapped;
      if (sum === 0) continue;
      for (const inventory of inventories) {
        if (inventory.id === row.inventoryId) {
          row.inventoryName = inventory.name;
          break;
        }
      }

      stocks.push(row);
    }
    res.status(200).json(stocks);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const downloadSingleSiteReport = async (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filename = "report.pdf";
    const pdfStream = doc.pipe(fs.createWriteStream(filename));

    // PDF metadata
    doc.info["Title"] = "Sitewise Inventory Report";

    // Fetch data from the database
    const [rows0, fields] = await pool.query(
      `SELECT * FROM stocks WHERE siteId = ?`,
      [req.params.id]
    );
    const [sites] = await pool.query("SELECT name FROM sites WHERE id = ?", [
      req.params.id,
    ]);
    const [inventories] = await pool.query("SELECT * FROM inventories");
    const rows = [];
    for (const row of rows0) {
      const sum = row.available + row.serviceable + row.scrapped;
      if (sum === 0) continue;
      for (const inventory of inventories) {
        if (inventory.id === row.inventoryId) {
          row.inventoryName = inventory.name;
          break;
        }
      }

      rows.push(row);
    }

    // Create table data
    let count = 1;
    const table = {
      title: sites[0].name,
      headers: [
        { label: "Sl.No", property: "slNo", width: 50, renderer: null },
        { label: "Inventory", property: "name", width: 200, renderer: null },
        {
          label: "Available",
          property: "available",
          width: 100,
          renderer: null,
        },
        {
          label: "Serviceable",
          property: "serviceable",
          width: 100,
          renderer: null,
        },
        {
          label: "Scrapped",
          property: "scrapped",
          width: 100,
          renderer: null,
        },
      ],
      rows: rows.map((row) => [
        count++,
        row.inventoryName,
        row.available,
        row.serviceable,
        row.scrapped,
      ]),
    };

    // Calculate the horizontal center position for the table
    const pageWidth = doc.page.width;
    const tableWidth = 550; // Assuming each column is 100 units wide
    const centerX = (pageWidth - tableWidth) / 2;

    // Center the table horizontally on the page
    doc.table(table, {
      width: tableWidth,
      x: centerX,
    });

    // Respond to the request with the PDF as a download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe the PDF stream to the response
    pdfStream.on("finish", () => {
      fs.createReadStream(filename).pipe(res);
    });

    // End the PDF creation
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Something broke!");
  }
};

export const downloadReportPdf = async (req, res) => {
  try {
    const currentDate = getLocalDate();

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filename = `report-sitewise on ${currentDate}.pdf`;
    const pdfStream = doc.pipe(fs.createWriteStream(filename));

    // PDF metadata
    doc.info["Title"] = "Sitewise Inventory Report";

    // Fetch data from the database
    const report = await getStockSitewise();
    // const [rows] = await pool.query("SELECT * FROM sites");

    for (const rows of report) {
      // Create table data
      let count = 1;
      const table = {
        title: rows.siteName,
        headers: [
          { label: "Sl.No", property: "slNo", width: 50, renderer: null },
          { label: "Inventory", property: "name", width: 200, renderer: null },
          {
            label: "Available",
            property: "available",
            width: 100,
            renderer: null,
          },
          {
            label: "Serviceable",
            property: "serviceable",
            width: 100,
            renderer: null,
          },
          {
            label: "Scrapped",
            property: "scrapped",
            width: 100,
            renderer: null,
          },
        ],
        rows: rows.stocks.map((row) => [
          count++,
          row.inventoryName,
          row.available,
          row.serviceable,
          row.scrapped,
        ]),
      };

      // Calculate the horizontal center position for the table
      const pageWidth = doc.page.width;
      const tableWidth = 550; // Assuming each column is 100 units wide
      const centerX = (pageWidth - tableWidth) / 2;

      // Center the table horizontally on the page
      doc.table(table, {
        width: tableWidth,
        x: centerX,
      });
    }

    // Respond to the request with the PDF as a download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe the PDF stream to the response
    pdfStream.on("finish", () => {
      fs.createReadStream(filename).pipe(res);
    });

    // End the PDF creation
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Something broke!");
  }
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

export const getStocksItemwise = async () => {
  try {
    const [inventories] = await pool.query(`SELECT id, name FROM inventories`);
    const [sites] = await pool.query("SELECT id, name FROM sites");
    const [stocks] = await pool.query("SELECT * FROM stocks");

    const report = [];
    for (const inventory of inventories) {
      const inventoryStocks = [];
      console.log(inventory);
      for (const stock of stocks) {
        if (stock.inventoryId === inventory.id) {
          for (const site of sites) {
            if (site.id === stock.siteId) {
              stock.siteName = site.name;
              break;
            }
          }

          const sum = stock.available + stock.serviceable + stock.scrapped;
          if (sum > 0) inventoryStocks.push(stock);
        }
      }

      if (inventoryStocks.length > 0) {
        report.push({ inventoryName: inventory.name, stocks: inventoryStocks });
      }
    }
    return report;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const getStocksByInventories = async (req, res) => {
  try {
    const report = await getStocksItemwise();
    res.status(200).json(report);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const downloadReportItemwise = async (req, res) => {
  try {
    const currentDate = getLocalDate();

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filename = `report-itemwise on ${currentDate}.pdf`;
    const pdfStream = doc.pipe(fs.createWriteStream(filename));

    // PDF metadata
    doc.info["Title"] = "Inventory wise Stock Report";

    // Fetch data from the database
    const report = await getStocksItemwise();
    
    for (const inventory of report) {
      // Create table data
      let count = 1;
      const table = {
        title: inventory.inventoryName,
        headers: [
          { label: "Sl.No", property: "slNo", width: 50, renderer: null },
          { label: "Site", property: "name", width: 200, renderer: null },
          {
            label: "Available",
            property: "available",
            width: 100,
            renderer: null,
          },
          {
            label: "Serviceable",
            property: "serviceable",
            width: 100,
            renderer: null,
          },
          {
            label: "Scrapped",
            property: "scrapped",
            width: 100,
            renderer: null,
          },
        ],
        rows: inventory.stocks.map((stock) => [
          count++,
          stock.siteName,
          stock.available,
          stock.serviceable,
          stock.scrapped,
        ]),
      };

      // Calculate the horizontal center position for the table
      const pageWidth = doc.page.width;
      const tableWidth = 550; // Assuming each column is 100 units wide
      const centerX = (pageWidth - tableWidth) / 2;

      // Center the table horizontally on the page
      doc.table(table, {
        width: tableWidth,
        x: centerX,
      });
    }

    // Respond to the request with the PDF as a download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe the PDF stream to the response
    pdfStream.on("finish", () => {
      fs.createReadStream(filename).pipe(res);
    });

    // End the PDF creation
    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
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
    const inventoryId = req.params.id;
    const [rows0] = await pool.query(`SELECT siteId FROM users WHERE id = ?`, [
      userId,
    ]);
    const [names] = await pool.query(
      `SELECT name FROM inventories WHERE id = ?`,
      [inventoryId]
    );
    const [rows] = await pool.query(
      `SELECT id, available, serviceable, scrapped FROM prevStocks WHERE siteId = ? AND inventoryId = ?`,
      [rows0[0].siteId, inventoryId]
    );
    console.log(rows);
    const [stockRows] = await pool.query(
      `SELECT id, available, serviceable, scrapped FROM stocks WHERE siteId = ? AND inventoryId = ?`,
      [rows0[0].siteId, inventoryId]
    );
    console.log(stockRows);
    const stockId = stockRows[0].id;

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
      [rows[0].available, rows[0].serviceable, rows[0].scrapped, stockId]
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
      id: inventoryId,
      name: names[0].name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
