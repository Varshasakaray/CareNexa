import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, bookingAPI } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import ChatModal from "../components/Chat/ChatModal";
import { MessageCircle } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        userAPI.getProfile(),
        bookingAPI.getHistory(),
      ]);

      if (profileRes.data.success) {
        setUser(profileRes.data.data);
      }

      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
    } catch (error) {
      console.error(error);
      // toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await bookingAPI.cancel(bookingId);
      if (response.data.success) {
        toast.success("Booking cancelled");
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleRate = async (bookingId, rating, feedback) => {
    try {
      const response = await bookingAPI.rate(bookingId, { rating, feedback });
      if (response.data.success) {
        toast.success("Rating submitted!");
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (!user)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-6 space-y-6">
          <Card className="p-6 text-center">
            <h2 className="text-2xl font-semibold text-red-600">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mt-2">
              Please login to view your dashboard.
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
          </Card>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <Button
            onClick={() => navigate("/booking/helpers")}
            variant="outline"
          >
            Browse Helpers
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Total Bookings: {user.totalBookings || 0} | Completed:{" "}
            {user.completedBookings || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">My Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{booking.hospitalName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.appointmentTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Address: {booking.patientAddress}
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        Total: ₹{booking.totalPrice}
                      </p>
                      <Badge className="mt-2">{booking.status}</Badge>
                    </div>
                  </div>

                  {booking.status === "accepted" && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800">
                        OTP sent to your email. Please share it with your helper
                        for verification.
                      </p>
                    </div>
                  )}

                  {booking.status === "duty_completed" && !booking.rating && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">
                        Rate this helper:
                      </p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            size="sm"
                            variant="outline"
                            onClick={() => handleRate(booking._id, rating, "")}
                          >
                            {rating} ⭐
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.rating && (
                    <p className="text-sm text-gray-600 mt-2">
                      Rated: {booking.rating}/5 ⭐
                    </p>
                  )}

                  {["pending", "accepted"].includes(booking.status) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                  )}

                  {/* Chat Button - Only after acceptance */}
                  {["accepted", "otp_sent", "otp_verified", "duty_completed"].includes(booking.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 ml-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsChatOpen(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with Helper
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Chat Modal Integration */}
        {selectedBooking && (
          <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            bookingId={selectedBooking._id}
            currentUserId={user._id}
            currentUserType="User"
            otherPartyName={selectedBooking.helperId?.fullName || "Helper"}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
