import { ArrowRight, Heart, Shield, Users } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { getData } from '@/context/userContext'
import { Link } from 'react-router-dom'

const Hero = () => {
    const {user} = getData()
  const navigate = useNavigate()
  return (
    <div className="relative w-full md:h-[700px] h-screen bg-blue-50 overflow-hidden">
      <section className=" w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
           {
            user && <h1 className='font-bold text-2xl'>Welcome {user.username}</h1>
           }
            
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-4 text-blue-800 border border-blue-200">
                <Heart className="w-3 h-3 mr-1" />
                Trusted Care Services
              </Badge>
              <h1 className="text-blue-600 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Compassionate Care,
                <span className="text-gray-800"> Right at Home</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Connect with verified caregivers for your loved ones. Professional, reliable, and dedicated to improving quality of life.
              </p>
            </div>
            <div className="space-x-4">
              <Button onClick={()=>navigate('/booking/helpers')} size="lg" className="h-12 px-8 relative bg-[#00b4d8] hover:bg-[#0096c7]">
                Find a Helper
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={()=>navigate('/helper/register')} variant="outline" size="lg" className="h-12 px-8 bg-white text-blue-800 border-blue-200 hover:bg-blue-50">
                Join as Helper
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-800 mt-8">
              <span className="flex items-center"><Shield className="w-4 h-4 mr-1"/> Verified Helpers</span>
              <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> 24/7 Support</span>
            </div>
            
            {!user && (
              <div className="mt-8 pt-8 border-t border-blue-100">
                <p className="text-xs text-gray-500 mb-2">Administrative Access</p>
                <Link to="/login" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;