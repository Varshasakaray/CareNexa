import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { helperAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const HelperLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter registration number, 2: Enter OTP
  const [helperRegistrationNumber, setHelperRegistrationNumber] = useState('');
  const [helperId, setHelperId] = useState(null);
  const [otp, setOtp] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!helperRegistrationNumber.trim()) {
      toast.error('Please enter your Helper Registration Number');
      return;
    }

    setLoading(true);
    try {
      const response = await helperAPI.sendLoginOTP({ helperRegistrationNumber });
      
      if (response.data.success) {
        setHelperId(response.data.helperId);
        setStep(2);
        toast.success('OTP sent to your registered email address');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await helperAPI.verifyLoginOTP({ helperId, otp });
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userType', 'helper');
        localStorage.setItem('helper', JSON.stringify(response.data.helper));
        toast.success(response.data.message);
        navigate('/helper/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-6">
          <h2 className="text-3xl font-bold text-center mb-6">Helper Login</h2>
          
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <Label htmlFor="helperRegistrationNumber">Helper Registration Number *</Label>
                <Input
                  id="helperRegistrationNumber"
                  name="helperRegistrationNumber"
                  type="text"
                  required
                  value={helperRegistrationNumber}
                  onChange={(e) => setHelperRegistrationNumber(e.target.value)}
                  placeholder="HRN-YYYYMMDD-XXXXX"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your Helper Registration Number. OTP will be sent to your registered email.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP *</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Check your registered email for the OTP
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setHelperId(null);
                  }}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </form>
          )}
          
          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account? <a href="/helper/register" className="text-blue-600">Register</a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default HelperLogin;
