import { Router } from "express";
import { login, register } from "@/controllers";

const router = Router();

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

export default router;
