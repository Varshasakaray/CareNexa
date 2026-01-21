import express from "express";
import { 
    addMedication, 
    getMedications, 
    getMedicationById, 
    updateMedication, 
    deleteMedication 
} from "../controllers/medicationController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, addMedication);
router.get("/", isAuthenticated, getMedications);
router.get("/:id", isAuthenticated, getMedicationById);
router.put("/:id", isAuthenticated, updateMedication);
router.delete("/:id", isAuthenticated, deleteMedication);

export default router;
