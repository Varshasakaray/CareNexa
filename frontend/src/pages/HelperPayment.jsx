import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { helperAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const HelperPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const helperId = location.state?.helperId;
  const registrationFee = location.state?.registrationFee || 10;

  useEffect(() => {
    if (!helperId) {
      toast.error('Invalid registration data');
      navigate('/helper/register');
    }
  }, [helperId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    setLoading(true);
    try {
      const response = await helperAPI.payment({ helperId, transactionId });
      if (response.data.success) {
        toast.success('Payment completed! Waiting for admin verification.');
        navigate('/helper/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="transactionId">Transaction ID *</Label>
            <Input
              id="transactionId"
              name="transactionId"
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter payment transaction ID"
            />
            <p className="text-xs text-gray-500 mt-1">
              Complete payment of ₹{registrationFee} and enter the transaction ID here
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        </form>
        </Card>
      </div>
    </div>
  );
};

export default HelperPayment;
