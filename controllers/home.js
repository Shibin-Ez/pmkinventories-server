import pool from "../pool.js";

// READ
export const getSideBoxes = async (req, res) => {
  try {
    const query = `SELECT
        COUNT(CASE WHEN userRole = 'user' THEN 1 END) AS users,
        COUNT(CASE WHEN userRole = 'admin' THEN 1 END) AS admins,
        COUNT(CASE WHEN userRole = 'manager' THEN 1 END) AS managers,
        COUNT(CASE WHEN userRole = 'director' THEN 1 END) AS directors
    FROM users;`;
    const [rows] = await pool.query(query);
    const users = Object.keys(rows[0]).map((key) => [key, rows[0][key]]);;

    const query2 = `SELECT
        COUNT(CASE WHEN siteType = 'workingSite' THEN 1 END) AS workingSites,
        COUNT(CASE WHEN siteType = 'godown' THEN 1 END) AS godowns
    FROM sites;`;
    const [rows2] = await pool.query(query2);
    const sites = Object.keys(rows2[0]).map((key) => [key, rows2[0][key]]);;

    const query3 = `SELECT COUNT(*) AS inventories FROM inventories;`;
    const [rows3] = await pool.query(query3);
    const inventories = Object.keys(rows3[0]).map((key) => [key, rows3[0][key]]);;

    res.status(200).json({ users, sites, inventories});
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke!");
  }
};
