import { Router } from "express";
import { login, refreshToken, register } from "@/controllers";

const router = Router();

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Refresh token
router.post("/refresh-token", refreshToken);

export default router;
