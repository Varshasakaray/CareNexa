import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingAPI } from "../lib/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import PaymentModal from "../components/PaymentModal";

const CreateBooking = () => {
  const navigate = useNavigate();
  const { helperId } = useParams();
  const [helper, setHelper] = useState(null);
  const [priceDetails, setPriceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientAddress: "",
    hospitalName: "",
    appointmentTime: "",
    isEmergency: false,
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    loadHelperDetails();
  }, [helperId]);

  useEffect(() => {
    if (formData.appointmentTime) {
      calculatePrice();
    }
  }, [formData.appointmentTime, formData.isEmergency]);

  const loadHelperDetails = async () => {
    try {
      const response = await bookingAPI.getHelperDetails(helperId);
      if (response.data.success) {
        setHelper(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load helper details");
      navigate("/booking/helpers");
    }
  };

  const calculatePrice = async () => {
    if (!formData.appointmentTime) return;

    try {
      const response = await bookingAPI.calculatePrice({
        appointmentTime: formData.appointmentTime,
        isEmergency: formData.isEmergency,
      });
      if (response.data.success) {
        setPriceDetails(response.data.data);
      }
    } catch (error) {
      console.error("Price calculation failed");
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsPaymentModalOpen(false);
    setLoading(true);

    try {
      const response = await bookingAPI.create({
        helperId,
        ...formData,
        paymentDetails,
      });

      if (response.data.success) {
        toast.success("Payment Successful! Booking created.");
        navigate("/user/bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed after payment");
    } finally {
      setLoading(false);
    }
  };

  if (!helper)
    return (
      <div>
        <Navbar />
        <div className="p-8">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Create Booking</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Helper Details</h2>
          <div className="flex items-center gap-4">
            {helper.profilePhoto ? (
              <img
                src={`http://localhost:8000/uploads/${helper.profilePhoto.split(/[\\/]/).pop()}`}
                alt={helper.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}

            <div
              className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-200"
              style={{ display: helper.profilePhoto ? "none" : "flex" }}
            >
              <span className="text-2xl font-bold text-gray-500">
                {helper.fullName?.charAt(0).toUpperCase() || "H"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-lg">{helper.fullName}</p>
              <p className="text-sm text-gray-600">
                Rating: {helper.averageRating || "N/A"}/5
              </p>
              <p className="text-sm text-gray-600">
                {helper.completedDuties} duties completed
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="patientAddress">Patient Address *</Label>
              <Input
                id="patientAddress"
                name="patientAddress"
                type="text"
                required
                value={formData.patientAddress}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="hospitalName">Hospital Name *</Label>
              <Input
                id="hospitalName"
                name="hospitalName"
                type="text"
                required
                value={formData.hospitalName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="appointmentTime">Appointment Date & Time *</Label>
              <Input
                id="appointmentTime"
                name="appointmentTime"
                type="datetime-local"
                required
                value={formData.appointmentTime}
                onChange={handleChange}
                min={new Date(Date.now() + 15 * 60 * 1000)
                  .toISOString()
                  .slice(0, 16)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 15 minutes prior booking required
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isEmergency"
                name="isEmergency"
                type="checkbox"
                checked={formData.isEmergency}
                onChange={handleChange}
              />
              <Label htmlFor="isEmergency">Emergency Booking</Label>
            </div>

            {priceDetails && (
              <Card className="p-4 bg-blue-50">
                <h3 className="font-semibold mb-2">Price Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>₹{priceDetails.basePrice}</span>
                  </div>
                  {priceDetails.earlyMorningCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Early Morning Charge:</span>
                      <span>₹{priceDetails.earlyMorningCharge}</span>
                    </div>
                  )}
                  {priceDetails.nightCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Night Charge:</span>
                      <span>₹{priceDetails.nightCharge}</span>
                    </div>
                  )}
                  {priceDetails.emergencyCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Emergency Charge:</span>
                      <span>₹{priceDetails.emergencyCharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>₹{priceDetails.totalPrice}</span>
                  </div>
                </div>
              </Card>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !priceDetails}
            >
              {loading ? "Creating Booking..." : "Create Booking"}
            </Button>
          </form>
        </Card>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={priceDetails?.totalPrice || 0}
      />
    </div>
  );
};

export default CreateBooking;
