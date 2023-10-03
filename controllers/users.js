import pool from "../pool.js";
import PDFDocument from "pdfkit-table";
import fs from "fs";

// CREATE
export const createUser = async (req, res) => {
  try {
    const { userRole, name, siteId, mobileNo, email } = req.body;
    console.log(req.body);
    if (userRole && name) {
      const otp = "$" + Math.floor(1000 + Math.random() * 8900);
      const [rows0] = await pool.query(
        `SELECT COUNT(*) AS rowCount
        FROM users
        WHERE userRole = ?`,
        [userRole]
      );
      console.log(rows0);
      let userId = rows0[0].rowCount + 1;
      switch (userRole) {
        case "director":
          userId = 10000 + userId;
          break;
        case "manager":
          userId = 20000 + userId;
          break;
        case "admin":
          userId = 30000 + userId;
          break;
        case "user":
          userId = 40000 + userId;
          break;
      }
      let sites = [];
      if (siteId) {
        [sites] = await pool.query(`SELECT name FROM sites WHERE id = ?`, [
          siteId,
        ]);
      }
      const siteName = sites[0] ? sites[0].name : "";
      const [rows, fields] = await pool.query(
        `INSERT INTO users (userRole, name, userId, siteId, siteName, mobileNo, email, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userRole, name, userId, siteId, siteName, mobileNo, email, otp]
      );
      const link =
        "https://tinyurl.com/2h2ajwcc";
      let manualLink = "";
      switch (userRole) {
        case "director":
          manualLink =
            "https://tinyurl.com/5n7s4z9r";
          break;
        case "admin":
          manualLink =
            "https://tinyurl.com/vibgreen";
          break;
        case "user":
          manualLink =
            "https://tinyurl.com/57uaycjh";
          break;
      }
      res
        .status(201)
        .json({ ...req.body, link, manualLink, userId, passwordHash: otp.split("$")[1] });
    } else {
      res.status(409).json({ message: "Please provide userRole and name" });
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
    console.log(err);
  }
};

// READ
export const getUsers = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const getUser = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};

export const downloadUsersPdf = async (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filename = "users_list.pdf";
    const pdfStream = doc.pipe(fs.createWriteStream(filename));

    // PDF metadata
    doc.info["Title"] = "Users";

    // Fetch data from the database
    const [rows] = await pool.query("SELECT * FROM users");

    // Create table data
    const table = {
      title: "Users",
      headers: [
        { label: "User Id", property: "id", width: 40, renderer: null },
        { label: "Name", property: "name", width: 80, renderer: null },
        { label: "User Role", property: "role", width: 50, renderer: null },
        { label: "Site Name", property: "siteName", width:150, renderer: null},
        { label: "Mobile No", property: "mobileNo", width: 90, renderer: null },
        { label: "Email", property: "email", width: 90, renderer: null },
      ],
      rows: rows.map((row) => [
        row.userId,
        row.name,
        row.userRole,
        row.siteName,
        row.mobileNo,
        row.email,
      ]),
    };

    // Calculate the horizontal center position for the table
    const pageWidth = doc.page.width;
    const tableWidth = 500; // Assuming each column is 100 units wide
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
export const updateUser = async (req, res) => {
  try {
    const { userRole, name, siteId, mobileNo, email } = req.body;
    console.log("get body");
    console.log(req.body);
    if (userRole && name) {
      let sites = [];
      if (siteId) {
        [sites] = await pool.query(`SELECT name FROM sites WHERE id = ?`, [
          siteId,
        ]);
      }
      const siteName = sites[0] ? sites[0].name : "";
      const [rows, fields] = await pool.query(
        `UPDATE users SET userRole = ?, name = ?, siteId = ?, siteName = ?, mobileNo = ?, email = ? WHERE id = ?`,
        [userRole, name, siteId, siteName, mobileNo, email, req.params.id]
      );
      res.json({ id: rows.insertId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
