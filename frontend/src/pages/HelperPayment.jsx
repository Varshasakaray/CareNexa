import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { helperAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';

const HelperPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const helperId = location.state?.helperId;
  const registrationFee = location.state?.registrationFee || 10;

  useEffect(() => {
    if (!helperId) {
      toast.error('Invalid registration data');
      navigate('/helper/register');
    }
  }, [helperId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsPaymentModalOpen(false);
    setLoading(true);
    try {
      const response = await helperAPI.payment({ helperId, paymentDetails });
      if (response.data.success) {
        toast.success("Payment Successful! Waiting for admin verification.");
        navigate("/helper/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Complete Registration Payment</h2>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center text-2xl font-bold text-blue-600">₹{registrationFee}</p>
          <p className="text-center text-sm text-gray-600 mt-2">Registration Fee</p>
        </div>
        <div className="space-y-4">
          <div className="text-center p-4 border border-blue-100 rounded-xl bg-blue-50/50">
            <p className="text-sm text-blue-600 font-medium mb-1">Total Due</p>
            <p className="text-4xl font-black text-blue-900">₹{registrationFee}</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Secure 256-bit encrypted payment
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Instant verification
            </p>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </div>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          amount={registrationFee}
        />
        </Card>
      </div>
    </div>
  );
};

export default HelperPayment;
