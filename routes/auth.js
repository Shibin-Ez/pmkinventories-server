import express from "express";
import { loginUser } from "../controllers/auth.js";

const router = express.Router();

// CREATE
router.post("/login", loginUser);


export default router;