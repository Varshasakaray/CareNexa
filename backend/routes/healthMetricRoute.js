import express from "express";
import { 
    addHealthMetric, 
    getHealthMetrics, 
    getHealthMetricById, 
    updateHealthMetric, 
    deleteHealthMetric 
} from "../controllers/healthMetricController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, addHealthMetric);
router.get("/", isAuthenticated, getHealthMetrics);
router.get("/:id", isAuthenticated, getHealthMetricById);
router.put("/:id", isAuthenticated, updateHealthMetric);
router.delete("/:id", isAuthenticated, deleteHealthMetric);

export default router;
