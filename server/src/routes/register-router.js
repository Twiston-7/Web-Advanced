import express from 'express';
import register from "../controllers/register-controller.js";

const router = express.Router();

router.post("/", register.registerUser);

export default router;