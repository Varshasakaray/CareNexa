import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../lib/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const BrowseHelpers = () => {
  const navigate = useNavigate();
  const [pincode, setPincode] = useState('');
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!pincode.trim()) {
      toast.error('Please enter a pincode');
      return;
    }

    setLoading(true);
    try {
      const response = await bookingAPI.browseHelpers(pincode);
      if (response.data.success) {
        setHelpers(response.data.data);
        if (response.data.data.length === 0) {
          toast.info('No helpers found in this pincode');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch helpers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (helperId) => {
    navigate(`/booking/helper/${helperId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Helpers</h1>
      
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpers.map(helper => (
          <Card key={helper._id} className="p-6">
            <div className="flex flex-col items-center text-center">
              {helper.profilePhoto ? (
                <img
                  src={`http://localhost:8000/uploads/${helper.profilePhoto.split(/[\\/]/).pop()}`}
                  alt={helper.fullName}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              <div 
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 border-4 border-blue-200"
                style={{ display: helper.profilePhoto ? 'none' : 'flex' }}
              >
                <span className="text-2xl font-bold text-gray-500">
                  {helper.fullName?.charAt(0).toUpperCase() || 'H'}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2">{helper.fullName}</h3>
              <div className="flex gap-2 justify-center mb-2">
                <Badge>⭐ {helper.averageRating || 'N/A'}</Badge>
                {helper.trustBadge && <Badge variant="default">Trusted</Badge>}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {helper.completedDuties} duties completed
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Experience: {helper.experienceLevel}
              </p>
              <Button
                className="w-full"
                onClick={() => handleViewDetails(helper._id)}
              >
                View Details & Book
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {helpers.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          Enter a pincode to search for helpers
        </div>
      )}
      </div>
    </div>
  );
};

export default BrowseHelpers;
