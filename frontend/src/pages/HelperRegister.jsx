import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { helperAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const HelperRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    mobileNumber: '',
    email: '',
    aadhaarNumber: '',
    address: '',
    pincode: '',
    password: '',
    emergencyContactName: '',
    emergencyContactMobile: '',
    emergencyContactRelation: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [governmentIdProof, setGovernmentIdProof] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profilePhoto') {
        setProfilePhoto(file);
      } else {
        setGovernmentIdProof(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key.startsWith('emergencyContact')) {
          // Skip, will add as nested object
        } else {
          data.append(key, formData[key]);
        }
      });

      // Add emergency contact as JSON
      data.append('emergencyContact', JSON.stringify({
        name: formData.emergencyContactName,
        mobile: formData.emergencyContactMobile,
        relation: formData.emergencyContactRelation,
      }));

      if (profilePhoto) data.append('profilePhoto', profilePhoto);
      if (governmentIdProof) data.append('governmentIdProof', governmentIdProof);

      const response = await helperAPI.register(data);
      
      if (response.data.success) {
        toast.success('Registration successful! Please complete payment.');
        navigate('/helper/payment', { 
          state: { 
            helperId: response.data.data.helperId,
            registrationFee: response.data.data.registrationFee 
          } 
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Helper Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="age">Age (18-45) *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="18"
                max="45"
                required
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="aadhaarNumber">Aadhaar Number (12 digits) *</Label>
            <Input
              id="aadhaarNumber"
              name="aadhaarNumber"
              type="text"
              maxLength="12"
              required
              value={formData.aadhaarNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              name="pincode"
              type="text"
              required
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Emergency Contact *</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Name</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  type="text"
                  required
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactMobile">Mobile</Label>
                <Input
                  id="emergencyContactMobile"
                  name="emergencyContactMobile"
                  type="tel"
                  required
                  value={formData.emergencyContactMobile}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactRelation">Relation</Label>
                <Input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  type="text"
                  required
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profilePhoto">Profile Photo *</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profilePhoto')}
                required
              />
            </div>
            <div>
              <Label htmlFor="governmentIdProof">Government ID Proof (Optional)</Label>
              <Input
                id="governmentIdProof"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'governmentIdProof')}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register (₹10 Registration Fee)'}
          </Button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already registered? <a href="/helper/login" className="text-blue-600">Login</a>
        </p>
        </Card>
      </div>
    </div>
  );
};

export default HelperRegister;
