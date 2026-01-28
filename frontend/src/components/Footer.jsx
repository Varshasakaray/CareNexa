import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] bg-clip-text text-transparent">
              CareNexa
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Empowering healthcare through digital innovation. Connecting patients, helpers, and providers for a seamless care experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00b4d8] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00b4d8] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00b4d8] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00b4d8] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 hover:text-[#00b4d8] transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-[#00b4d8] transition-colors">About Us</a></li>
              <li><a href="/features" className="text-gray-600 hover:text-[#00b4d8] transition-colors">Features</a></li>
              <li><a href="/booking/helpers" className="text-gray-600 hover:text-[#00b4d8] transition-colors">Find a Helper</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#00b4d8] transition-colors">Patient Care</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#00b4d8] transition-colors">Helper Booking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#00b4d8] transition-colors">Health Metrics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#00b4d8] transition-colors">Medication Management</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-[#00b4d8] mt-1 shrink-0" />
                <span>123 Healthcare Ave, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-[#00b4d8] shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-[#00b4d8] shrink-0" />
                <span>support@carenexa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CareNexa. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#00b4d8] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#00b4d8] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#00b4d8] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
