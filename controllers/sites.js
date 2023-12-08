import pool from "../pool.js";
import PDFDocument from "pdfkit-table";
import fs from "fs";

// CREATE
export const createSite = async (req, res) => {
  try {
    const { name, userId, siteType, address, latitude, longitude } = req.body;
    console.log(userId);
    if (name && siteType) {
      const [rows, fields] = await pool.query(
        `INSERT INTO sites (name, siteType, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)`,
        [name, siteType, address, latitude, longitude]
      );

      const [rows2] = await pool.query(`UPDATE sites SET siteId = 1000+id`);

      const [rows3] = await pool.query(
        `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, "create", "sites", "name", rows.insertId, "", name]
      );

      res.status(201).json({ id: rows.insertId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// READ
export const getSites = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM sites");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getSite = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM sites WHERE id = ${req.params.id}`
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const downloadSitePdf = async (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filename = "sites_list.pdf";
    const pdfStream = doc.pipe(fs.createWriteStream(filename));

    // PDF metadata
    doc.info["Title"] = "Site Details";

    // Fetch data from the database
    const [rows] = await pool.query("SELECT * FROM sites");

    // Create table data
    let count = 1;
    const table = {
      title: "Site Details",
      headers: [
        { label: "Sl.No", property: "slNo", width: 50, renderer: null },
        { label: "Site Id", property: "id", width: 50, renderer: null },
        { label: "Site Name", property: "name", width: 150, renderer: null },
        { label: "Site Type", property: "type", width: 100, renderer: null },
        { label: "Address", property: "address", width: 200, renderer: null },
      ],
      rows: rows.map((row) => [
        count++,
        row.id,
        row.name,
        row.siteType,
        row.address,
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

// UPDATE
export const updateSite = async (req, res) => {
  try {
    const { name, userId, siteType, address, latitude, longitude } = req.body;
    console.log(req.body);

    if (name && siteType) {
      const [rows0] = await pool.query(`SELECT * FROM sites WHERE id = ?`, [
        req.params.id,
      ]);

      const [rows, fields] = await pool.query(
        `UPDATE sites SET name = ?, siteType = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?`,
        [name, siteType, address, latitude, longitude, req.params.id]
      );

      const prevName = rows0[0].name;
      const prevSiteType = rows0[0].siteType;
      const prevAddress = rows0[0].address;

      if (prevName !== name) {
        const [rows1] = await pool.query(
          `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, "update", "sites", "name", req.params.id, prevName, name]
        );
      }
      if (prevSiteType !== siteType) {
        const [rows1] = await pool.query(
          `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            "update",
            "sites",
            "siteType",
            req.params.id,
            prevSiteType,
            siteType,
          ]
        );
      }
      if (prevAddress !== address) {
        const [rows1] = await pool.query(
          `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            "update",
            "sites",
            "address",
            req.params.id,
            prevAddress,
            address,
          ]
        );
      }

      res.status(201).json({ id: req.params.id });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

// DELETE
export const deleteSite = async (req, res) => {
  try {
    const { userId, name } = req.body;

    const [users] = await pool.query(
      `SELECT id, name, userRole FROM users WHERE siteId = ?`,
      [req.params.id]
    );
    if (users.length > 0) {
      res
        .status(403)
        .send(
          `site has currently assigned with ${users[0].userRole} ${users[0].name} (userId: ${users[0].id})`
        );
      return;
    }

    const [stocks] = await pool.query(
      `SELECT id FROM stocks WHERE siteId = ?`,
      [req.params.id]
    );
    if (stocks.length > 0) {
      res.status(403).send(`site still has some stocks left`);
      return;
    }

    const [rows, fields] = await pool.query(`DELETE FROM sites WHERE id = ?`, [
      req.params.id,
    ]);

    console.log(rows);

    const [rows2, fields2] = await pool.query(
      `INSERT INTO crudLogs (userId, action, tableName, columnName, entryId, oldData, newData) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, "delete", "sites", "name", rows.insertId, name, ""]
    );

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
