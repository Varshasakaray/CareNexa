import express from "express";
import { getChatHistory, markAsRead } from "../controllers/chatController.js";
import { isAuthenticatedAll } from "../middleware/isAuthenticatedAll.js";

const router = express.Router();

router.get("/:bookingId", isAuthenticatedAll, getChatHistory);
router.put("/:bookingId/read", isAuthenticatedAll, markAsRead);

export default router;
