import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { getData } from '../context/userContext';

const HelperBookingHome = () => {
  const navigate = useNavigate();
  const { user } = getData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🩺 CareNexa Helper Booking
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with verified helpers for hospital visits and medical assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-2xl font-semibold mb-2">I'm a Patient</h2>
            <p className="text-gray-600 mb-4">
              Need help with hospital visits? Book a verified helper in your area.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => navigate('/patient/register')}
              >
                Register as Patient
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/patient/login')}
              >
                Patient Login
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/booking/helpers')}
              >
                Browse Helpers
              </Button>
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-2xl font-semibold mb-2">I'm a Helper</h2>
            <p className="text-gray-600 mb-4">
              Offer your services and help patients with their medical needs.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => navigate('/helper/register')}
              >
                Register as Helper
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/helper/login')}
              >
                Helper Login
              </Button>
            </div>
          </Card>
        </div>
        
        {!user && (
          <div className="mt-12 text-center">
             <Link to="/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
               Admin Login
             </Link>
          </div>
        )}

        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-2">1. Register</div>
                <p className="text-gray-600">Create your account as patient or helper</p>
              </div>
              <div>
                <div className="font-semibold mb-2">2. Browse/Offer</div>
                <p className="text-gray-600">Patients find helpers, helpers set availability</p>
              </div>
              <div>
                <div className="font-semibold mb-2">3. Book</div>
                <p className="text-gray-600">Create booking with verified OTP system</p>
              </div>
              <div>
                <div className="font-semibold mb-2">4. Complete</div>
                <p className="text-gray-600">Finish duty and rate the experience</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelperBookingHome;
