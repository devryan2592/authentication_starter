import { Router } from "express";
import { mobileLogin, webLogin, register } from "@/controllers";

const router = Router();

// Register user
router.post("/register", register);

// Login user
router.post("/login", webLogin);
router.post("/mobile-login", mobileLogin);

export default router;
