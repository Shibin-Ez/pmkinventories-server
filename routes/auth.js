import express from "express";
import { changePassword, loginUser, resetPassword } from "../controllers/auth.js";

const router = express.Router();

// CREATE
router.post("/login", loginUser);

// UPDATE
router.patch("/:id/set-password", changePassword);
router.patch("/:id/reset-password", resetPassword);


export default router;