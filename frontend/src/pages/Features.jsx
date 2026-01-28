import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Shield, Heart, Activity, Users, Calendar, Bell, Smartphone, UserCheck, Clock } from 'lucide-react';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#00b4d8] to-[#90e0ef] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Powerful Features for Complete Care
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Everything you need to manage health, coordinate care, and find trusted help - all in one platform.
          </motion.p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard 
              icon={<UserCheck className="w-10 h-10 text-[#00b4d8]" />}
              title="Verified Helpers"
              description="Access a network of background-checked, qualified caregivers ready to assist with hospital visits and home care."
            />
            <FeatureCard 
              icon={<Activity className="w-10 h-10 text-[#00b4d8]" />}
              title="Health Monitoring"
              description="Track vital signs like blood pressure, glucose levels, and weight with easy-to-read charts and history."
            />
            <FeatureCard 
              icon={<Bell className="w-10 h-10 text-[#00b4d8]" />}
              title="Medication Reminders"
              description="Never miss a dose with automated SMS and email reminders for you and your loved ones."
            />
            <FeatureCard 
              icon={<Calendar className="w-10 h-10 text-[#00b4d8]" />}
              title="Easy Scheduling"
              description="Book appointments with helpers seamlessly. View availability and manage bookings in real-time."
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-[#00b4d8]" />}
              title="Secure Data"
              description="Your health information is encrypted and protected with industry-standard security protocols."
            />
            <FeatureCard 
              icon={<Smartphone className="w-10 h-10 text-[#00b4d8]" />}
              title="Mobile Accessible"
              description="Manage care on the go with our fully responsive design optimized for all devices."
            />
          </motion.div>
        </div>
      </section>

      {/* Helper Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">For Caregivers & Helpers</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full mt-1">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Flexible Schedule</h3>
                    <p className="text-gray-600">Set your own availability and work when it suits you.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Direct Connection</h3>
                    <p className="text-gray-600">Connect directly with patients needing your specific skills.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full mt-1">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Rewarding Work</h3>
                    <p className="text-gray-600">Make a real difference in people's lives while earning.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold mb-4 text-[#00b4d8]">Join Our Network</h3>
                <p className="text-gray-600 mb-6">
                  Are you a compassionate individual looking to help others? Join CareNexa as a helper today.
                </p>
                <button className="w-full bg-[#00b4d8] text-white py-3 rounded-lg font-semibold hover:bg-[#0096c7] transition-colors">
                  Register as Helper
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}
    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
  >
    <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-lg">
      {description}
    </p>
  </motion.div>
);

export default Features;
