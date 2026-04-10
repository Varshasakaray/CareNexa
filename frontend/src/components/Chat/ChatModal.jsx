import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { chatAPI } from "../../lib/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { X, Send, Loader2 } from "lucide-react";

const ChatModal = ({ isOpen, onClose, bookingId, currentUserId, currentUserType, otherPartyName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state for new booking
    setMessages([]);
    setIsLoading(true);

    // 1. Initialize Socket
    socketRef.current = io("http://localhost:8000", {
      withCredentials: true,
    });

    // 2. Join Room
    socketRef.current.emit("join_room", bookingId);

    // 3. Fetch History
    const fetchHistory = async () => {
      try {
        const response = await chatAPI.getHistory(bookingId);
        if (response.data.success) {
          setMessages(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load chat history", error);
        toast.error("Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    // 4. Listen for messages
    socketRef.current.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 5. Listen for typing
    socketRef.current.on("user_typing", ({ senderName }) => {
      setTypingUser(senderName);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isOpen, bookingId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      bookingId,
      senderId: currentUserId,
      senderModel: currentUserType,
      content: newMessage,
    };

    socketRef.current.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleTyping = () => {
    socketRef.current.emit("typing", { 
        bookingId, 
        senderName: currentUserType === 'User' || currentUserType === 'Patient' ? 'Patient' : 'Helper' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg h-[600px] flex flex-col overflow-hidden shadow-2xl border-brand-primary/20 bg-white/95">
        {/* Header */}
        <div className="p-4 border-b bg-brand-primary text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              {otherPartyName?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{otherPartyName || "Chat"}</h3>
              <p className="text-xs text-white/80">Support Coordination</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Messages Layout */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">No messages yet</p>
              <p className="text-sm">Say hello to start the coordination!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg._id || index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      isMe
                        ? "bg-brand-primary text-white rounded-tr-none"
                        : "bg-white text-gray-800 border rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? "text-white/70" : "text-gray-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl rounded-tl-none p-2 px-4 shadow-sm">
                <p className="text-xs text-brand-primary animate-pulse font-medium">{typingUser} is typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            className="flex-1 focus-visible:ring-brand-primary border-gray-200"
          />
          <Button type="submit" disabled={!newMessage.trim()} className="bg-brand-primary hover:bg-brand-primary/90 shrink-0">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChatModal;
