import express from 'express';
import * as register from "../controllers/register-controller.js";

const router = express.Router();

router.post("/", register.registerUser);

export default router;