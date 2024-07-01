import express from "express";
import {
  getExchange,
  getExchanges,
  createExchange,
  getLastFewExchanges,
  getCrudLogs,
} from "../controllers/exchanges.js";

const router = express.Router();

// CREATE
// router.post("/", createExchange);

// READ
router.get("/", getExchanges);
router.get("/exchange/:id", getExchange);
router.get("/cruds", getCrudLogs);

// READ by POSTING
router.post("/lastfew", getLastFewExchanges);

export default router;