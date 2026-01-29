import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('helpers');
  const [pendingHelpers, setPendingHelpers] = useState([]);
  const [allHelpers, setAllHelpers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [rejectionReason, setRejectionReason] = useState({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'helpers') {
        const [pendingRes, allRes] = await Promise.all([
          adminAPI.getPendingHelpers(),
          adminAPI.getAllHelpers(),
        ]);
        if (pendingRes.data.success) setPendingHelpers(pendingRes.data.data);
        if (allRes.data.success) setAllHelpers(allRes.data.data);
      } else if (activeTab === 'bookings') {
        const [bookingsRes, statsRes] = await Promise.all([
          adminAPI.getAllBookings(),
          adminAPI.getBookingStats(),
        ]);
        if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
        if (statsRes.data.success) setStats(statsRes.data.data);
      } else if (activeTab === 'pricing') {
        const response = await adminAPI.getPricing();
        if (response.data.success) setPricing(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleApprove = async (helperId) => {
    try {
      const response = await adminAPI.approveHelper(helperId);
      if (response.data.success) {
        toast.success('Helper approved!');
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (helperId) => {
    if (!rejectionReason[helperId]) {
      toast.error('Please enter rejection reason');
      return;
    }

    try {
      const response = await adminAPI.rejectHelper(helperId, rejectionReason[helperId]);
      if (response.data.success) {
        toast.success('Helper rejected');
        setRejectionReason({ ...rejectionReason, [helperId]: '' });
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject');
    }
  };

  const handleUpdatePricing = async () => {
    try {
      const response = await adminAPI.updatePricing(pricing);
      if (response.data.success) {
        toast.success('Pricing updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update pricing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'helpers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('helpers')}
        >
          Helpers
        </Button>
        <Button
          variant={activeTab === 'bookings' ? 'default' : 'outline'}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </Button>
        <Button
          variant={activeTab === 'pricing' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing
        </Button>
      </div>

      {activeTab === 'helpers' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Helpers</h2>
            {pendingHelpers.length === 0 ? (
              <p className="text-gray-500">No pending helpers</p>
            ) : (
              <div className="space-y-4">
                {pendingHelpers.map(helper => (
                  <div key={helper._id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{helper.fullName}</p>
                        <p className="text-sm text-gray-600">{helper.email}</p>
                        <p className="text-sm text-gray-600">Mobile: {helper.mobileNumber}</p>
                        <p className="text-sm text-gray-600">Aadhaar: XXXX XXXX {helper.aadhaarLast4}</p>
                        <p className="text-sm text-gray-600">Age: {helper.age}</p>
                        <p className="text-sm text-gray-600">Pincode: {helper.pincode}</p>
                        <div className="mt-2 flex gap-4">
                          {helper.profilePhoto && (
                            <div>
                              <p className="text-xs font-semibold mb-1">Profile Photo</p>
                              <img
                                src={`http://localhost:8000/${helper.profilePhoto}`}
                                alt="Profile"
                                className="w-24 h-24 object-cover rounded-md border"
                              />
                            </div>
                          )}
                          {helper.governmentIdProof && (
                            <div>
                              <p className="text-xs font-semibold mb-1">Govt ID</p>
                              <a 
                                href={`http://localhost:8000/${helper.governmentIdProof}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={`http://localhost:8000/${helper.governmentIdProof}`}
                                  alt="Government ID"
                                  className="w-32 h-24 object-cover rounded-md border hover:opacity-80 transition-opacity"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(helper._id)}>
                          Approve
                        </Button>
                        <div className="flex flex-col gap-2">
                          <Input
                            placeholder="Rejection reason"
                            value={rejectionReason[helper._id] || ''}
                            onChange={(e) => setRejectionReason({
                              ...rejectionReason,
                              [helper._id]: e.target.value
                            })}
                            className="w-48"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(helper._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">All Helpers</h2>
            <div className="space-y-2">
              {allHelpers.map(helper => (
                <div key={helper._id} className="flex justify-between items-center border p-3 rounded">
                  <div>
                    <p className="font-semibold">{helper.fullName}</p>
                    <p className="text-sm text-gray-600">{helper.email}</p>
                    <Badge>{helper.verificationStatus}</Badge>
                  </div>
                  {helper.helperRegistrationNumber && (
                    <p className="text-sm">ID: {helper.helperRegistrationNumber}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.bookings.total}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold">{stats.bookings.today}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.revenue.total}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Active Helpers</p>
                <p className="text-2xl font-bold">{stats.helpers.active}</p>
              </Card>
            </div>
          )}

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
            <div className="space-y-2">
              {bookings.map(booking => (
                <div key={booking._id} className="border p-3 rounded">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{booking.hospitalName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.appointmentTime).toLocaleString()}
                      </p>
                      <p className="text-sm">Patient: {booking.patientId?.fullName}</p>
                      <p className="text-sm">Helper: {booking.helperId?.fullName}</p>
                    </div>
                    <div className="text-right">
                      <Badge>{booking.status}</Badge>
                      <p className="text-sm font-semibold mt-2">₹{booking.totalPrice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'pricing' && pricing && (
        <Card className="p-6 max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Update Pricing</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="basePrice">Base Price (₹)</Label>
              <Input
                id="basePrice"
                type="number"
                value={pricing.basePrice}
                onChange={(e) => setPricing({ ...pricing, basePrice: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="earlyMorningCharge">Early Morning Charge (₹)</Label>
              <Input
                id="earlyMorningCharge"
                type="number"
                value={pricing.earlyMorningCharge}
                onChange={(e) => setPricing({ ...pricing, earlyMorningCharge: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="nightCharge">Night Charge (₹)</Label>
              <Input
                id="nightCharge"
                type="number"
                value={pricing.nightCharge}
                onChange={(e) => setPricing({ ...pricing, nightCharge: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="emergencyCharge">Emergency Charge (₹)</Label>
              <Input
                id="emergencyCharge"
                type="number"
                value={pricing.emergencyCharge}
                onChange={(e) => setPricing({ ...pricing, emergencyCharge: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
              <Input
                id="registrationFee"
                type="number"
                value={pricing.registrationFee}
                onChange={(e) => setPricing({ ...pricing, registrationFee: parseInt(e.target.value) })}
              />
            </div>
            <Button onClick={handleUpdatePricing} className="w-full">
              Update Pricing
            </Button>
          </div>
        </Card>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
