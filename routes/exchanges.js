import express from "express";
import {
  getExchange,
  getExchanges,
  createExchange,
  getLastFewExchanges,
} from "../controllers/exchanges.js";

const router = express.Router();

// CREATE
// router.post("/", createExchange);

// READ
router.get("/", getExchanges);
router.get("/:id", getExchange);
router.post("/lastfew", getLastFewExchanges);

export default router;