import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Heart, Users, Target, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-[#f0f9ff] overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Caring for Communities, <span className="text-[#00b4d8]">Connecting Lives</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              CareNexa was born from a simple mission: to make healthcare support accessible, reliable, and compassionate for everyone.
            </motion.p>
          </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#00b4d8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#90e0ef]/20 rounded-full blur-3xl" />
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Bridging the Gap in Healthcare Support</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We strive to empower families by connecting them with trusted local helpers for hospital visits, medication management, and daily care assistance. We believe that no one should have to navigate their health journey alone.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl h-[400px] flex items-center justify-center relative overflow-hidden"
            >
               {/* Placeholder for an image */}
               <div className="absolute inset-0 bg-gray-300 animate-pulse" />
               <span className="relative z-10 text-gray-500 font-semibold">Mission Image Placeholder</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every interaction we have.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Heart className="w-8 h-8 text-red-500" />}
              title="Empathy First"
              description="We approach every situation with kindness and understanding, recognizing the human stories behind health needs."
            />
            <ValueCard 
              icon={<ShieldCheck className="w-8 h-8 text-blue-500" />}
              title="Trust & Safety"
              description="We rigorously verify every helper and protect user data to create a safe environment for our community."
            />
            <ValueCard 
              icon={<Users className="w-8 h-8 text-green-500" />}
              title="Community"
              description="We believe in the power of local support networks to improve quality of life and health outcomes."
            />
          </div>
        </div>
      </section>

      {/* Team Section (Optional/Placeholder) */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Team Member Placeholders */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-64 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <h3 className="font-bold text-lg">Team Member {item}</h3>
                <p className="text-blue-600 text-sm">Co-Founder</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ValueCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

export default About;
