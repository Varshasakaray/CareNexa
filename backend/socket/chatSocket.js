import { Server } from "socket.io";
import { Message } from "../models/messageModel.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room based on bookingId
    socket.on("join_room", (bookingId) => {
      socket.join(bookingId);
      console.log(`User ${socket.id} joined room ${bookingId}`);
    });

    // Listen for messages
    socket.on("send_message", async (data) => {
      const { bookingId, senderId, senderModel, content } = data;

      try {
        // Save message to database
        const newMessage = await Message.create({
          bookingId,
          senderId,
          senderModel,
          content,
        });

        // Broadcast message to everyone in the room (including sender)
        io.to(bookingId).emit("receive_message", newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Typing activity
    socket.on("typing", ({ bookingId, senderName }) => {
      socket.to(bookingId).emit("user_typing", { senderName });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
