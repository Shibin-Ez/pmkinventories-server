import pool from "../pool.js";

// CREATE - Initiate Order
export const createOrder = async (req, res) => {
  try {
    const { userId, siteId, materialId, quantity, note } = req.body;

    const [order] = await pool.query(
      "INSERT INTO orders (userId, siteId, materialId, quantity, note) VALUES (?, ?, ?, ?, ?)",
      [userId, siteId, materialId, quantity, note]
    );

    res.status(201).json({ id: order.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get All Orders
export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders");
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE - Approve order
export const approveOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { adminId, vendorId, note } = req.body;

    const [order] = await pool.query(
      "UPDATE orders SET status = ?, adminId = ?, vendorId = ?, note = ? WHERE id = ?",
      ["approved", adminId, vendorId, note, orderId]
    );

    res.status(200).json({ id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE - Update order from user side
export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { amount, deadline, invoiceNo, receiptURL, note } = req.body;

    const [order] = await pool.query(
      "UPDATE orders SET amount = ?, deadline = ?, invoiceNo = ?, receiptURL = ?, note = ? WHERE id = ?",
      [amount, deadline, invoiceNo, receiptURL, note, orderId]
    );

    res.status(200).json({ id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
