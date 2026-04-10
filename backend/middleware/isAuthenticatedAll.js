import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Patient } from "../models/patientModel.js";
import { Helper } from "../models/helperModel.js";

export const isAuthenticatedAll = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      const { id } = decoded;

      // Check User, Patient, and Helper collections
      let user = await User.findById(id);
      if (!user) user = await Patient.findById(id);
      if (!user) user = await Helper.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      req.userId = user._id;
      req.userType = user.constructor.modelName; // 'User', 'Patient', or 'Helper'
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
