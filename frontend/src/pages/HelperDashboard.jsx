import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { helperAPI, bookingAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import ChatModal from '../components/Chat/ChatModal';
import { MessageCircle } from 'lucide-react';

const HelperDashboard = () => {
  const navigate = useNavigate();
  const [helper, setHelper] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        helperAPI.getProfile(),
        bookingAPI.getHelperBookings(),
      ]);
      
      if (profileRes.data.success) {
        setHelper(profileRes.data.data);
      }
      
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const response = await helperAPI.toggleAvailability({ 
        isAvailable: !helper.isAvailable 
      });
      if (response.data.success) {
        setHelper({ ...helper, isAvailable: response.data.isAvailable });
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await bookingAPI.accept(bookingId);
      if (response.data.success) {
        toast.success('Booking accepted! OTP sent to patient.');
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const response = await bookingAPI.reject(bookingId);
      if (response.data.success) {
        toast.success('Booking rejected');
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject booking');
    }
  };

  const handleVerifyOTP = async (bookingId) => {
    if (!otp[bookingId]) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      const response = await bookingAPI.verifyOTP(bookingId, otp[bookingId]);
      if (response.data.success) {
        toast.success('OTP verified! Duty started.');
        setOtp({ ...otp, [bookingId]: '' });
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleCompleteDuty = async (bookingId) => {
    try {
      const response = await bookingAPI.complete(bookingId);
      if (response.data.success) {
        toast.success('Duty completed successfully!');
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete duty');
    }
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    mobileNumber: '',
    address: '',
    pincode: '',
    emergencyContactName: '',
    emergencyContactMobile: '',
    emergencyContactRelation: '',
  });

  useEffect(() => {
    if (helper) {
      setProfileData({
        fullName: helper.fullName || '',
        mobileNumber: helper.mobileNumber || '',
        address: helper.address || '',
        pincode: helper.pincode || '',
        emergencyContactName: helper.emergencyContact?.name || '',
        emergencyContactMobile: helper.emergencyContact?.mobile || '',
        emergencyContactRelation: helper.emergencyContact?.relation || '',
      });
    }
  }, [helper]);

  const handleUpdateProfile = async () => {
    try {
      const response = await helperAPI.updateProfile(profileData);
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setIsEditingProfile(false);
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <div className="p-8">Loading...</div>
    </div>
  );
  if (!helper) return (
    <div>
      <Navbar />
      <div className="p-8">Failed to load profile</div>
    </div>
  );

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => ['accepted', 'otp_verified'].includes(b.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Helper Dashboard</h1>
          <Button onClick={() => setIsEditingProfile(!isEditingProfile)} variant="outline">
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

      <Card className="p-6">
        {isEditingProfile ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  value={profileData.mobileNumber}
                  onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={profileData.pincode}
                  onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                />
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Emergency Contact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={(e) => setProfileData({ ...profileData, emergencyContactName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactMobile">Mobile</Label>
                  <Input
                    id="emergencyContactMobile"
                    value={profileData.emergencyContactMobile}
                    onChange={(e) => setProfileData({ ...profileData, emergencyContactMobile: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactRelation">Relation</Label>
                  <Input
                    id="emergencyContactRelation"
                    value={profileData.emergencyContactRelation}
                    onChange={(e) => setProfileData({ ...profileData, emergencyContactRelation: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleUpdateProfile} className="w-full">Save Changes</Button>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">{helper.fullName}</h2>
              <p className="text-gray-600">{helper.email}</p>
              {helper.helperRegistrationNumber && (
                <p className="text-sm text-gray-500">ID: {helper.helperRegistrationNumber}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Badge>{helper.experienceLevel}</Badge>
                {helper.trustBadge && <Badge variant="default">Trusted</Badge>}
                <Badge>Rating: {helper.averageRating}/5</Badge>
                <Badge>Duties: {helper.completedDuties}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Availability</p>
              <Button
                onClick={handleToggleAvailability}
                variant={helper.isAvailable ? "default" : "destructive"}
              >
                {helper.isAvailable ? '🟢 Active' : '🔴 Inactive'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Pending Bookings</h3>
          {pendingBookings.length === 0 ? (
            <p className="text-gray-500">No pending bookings</p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map(booking => (
                <div key={booking._id} className="border p-4 rounded-lg">
                  <p className="font-semibold">Hospital: {booking.hospitalName}</p>
                  <p className="text-sm text-gray-600">Time: {new Date(booking.appointmentTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Price: ₹{booking.totalPrice}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleAcceptBooking(booking._id)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRejectBooking(booking._id)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Active Bookings</h3>
          {activeBookings.length === 0 ? (
            <p className="text-gray-500">No active bookings</p>
          ) : (
            <div className="space-y-4">
              {activeBookings.map(booking => (
                <div key={booking._id} className="border p-4 rounded-lg">
                  <p className="font-semibold">Hospital: {booking.hospitalName}</p>
                  <p className="text-sm text-gray-600">Time: {new Date(booking.appointmentTime).toLocaleString()}</p>
                  <p className="text-sm">Status: <Badge>{booking.status}</Badge></p>
                  {booking.status === 'accepted' && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">Verify OTP (received from patient):</p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter OTP"
                          value={otp[booking._id] || ''}
                          onChange={(e) => setOtp({ ...otp, [booking._id]: e.target.value })}
                          className="max-w-xs"
                        />
                        <Button size="sm" onClick={() => handleVerifyOTP(booking._id)}>
                          Verify OTP
                        </Button>
                      </div>
                    </div>
                  )}
                  {booking.status === 'otp_verified' && (
                    <Button 
                      size="sm" 
                      className="mt-2" 
                      onClick={() => handleCompleteDuty(booking._id)}
                    >
                      Complete Duty
                    </Button>
                  )}

                  {/* Chat Button */}
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
                    Chat with Patient
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">All Bookings</h3>
        <div className="space-y-2">
          {bookings.map(booking => (
            <div key={booking._id} className="flex justify-between items-center border p-3 rounded">
              <div>
                <p className="font-semibold">{booking.hospitalName}</p>
                <p className="text-sm text-gray-600">{new Date(booking.appointmentTime).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Patient: {booking.userId?.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{booking.status}</Badge>
                {["accepted", "otp_sent", "otp_verified", "duty_completed"].includes(booking.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsChatOpen(true);
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      </div>

      {/* Chat Modal Integration */}
      {selectedBooking && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          bookingId={selectedBooking._id}
          currentUserId={helper._id}
          currentUserType="Helper"
          otherPartyName={selectedBooking.userId?.username || "Patient"}
        />
      )}
    </div>
  );
};

export default HelperDashboard;
