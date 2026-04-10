import { Message } from "../models/messageModel.js";
import { Booking } from "../models/bookingModel.js";

export const getChatHistory = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const currentUserId = req.userId;

    // 1. Verify booking exists and user has access
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the current user is either the patient or the helper for this booking
    const isPatient = booking.userId.toString() === currentUserId.toString();
    const isHelper = booking.helperId.toString() === currentUserId.toString();

    if (!isPatient && !isHelper) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this chat",
      });
    }

    // 2. Fetch messages
    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const currentUserId = req.userId;

    await Message.updateMany(
      { bookingId, senderId: { $ne: currentUserId }, isRead: false },
      { $set: { isRead: true } },
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
