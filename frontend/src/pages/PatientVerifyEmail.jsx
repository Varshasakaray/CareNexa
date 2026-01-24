import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientAPI } from '../lib/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const PatientVerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const response = await patientAPI.verifyEmail(token);
      if (response.data.success) {
        setVerified(true);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/patient/login');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-6 text-center">
        {loading ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Verifying Email...</h2>
            <p className="text-gray-600">Please wait</p>
          </div>
        ) : verified ? (
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Email Verified!</h2>
            <p className="text-gray-600 mb-4">Your email has been verified successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
            <p className="text-gray-600 mb-4">Click the button below to verify your email</p>
            <Button onClick={verifyEmail} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </div>
        )}
        </Card>
      </div>
    </div>
  );
};

export default PatientVerifyEmail;
