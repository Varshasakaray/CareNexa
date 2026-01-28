import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Heart,
  Activity,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

const Home = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay for skeleton demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const carouselItems = [
    {
      title: "Compassionate Care at Home",
      description: "Find trusted helpers for your loved ones with ease.",
      image:
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2076&auto=format&fit=crop",
    },
    {
      title: "Monitor Health Metrics",
      description:
        "Keep track of vital signs and share with doctors instantly.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Medication Management",
      description: "Never miss a dose with our smart reminder system.",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Carousel Section */}
      <section className="relative pt-8 pb-16 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="w-full h-[500px] rounded-3xl overflow-hidden relative">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Carousel className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
                <CarouselContent>
                  {carouselItems.map((item, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-[500px] w-full">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12 text-white">
                          <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {item.title}
                          </h2>
                          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl">
                            {item.description}
                          </p>
                          <div className="flex gap-4">
                            <Link to="/signup">
                              <Button
                                size="lg"
                                className="bg-[#00b4d8] hover:bg-[#0096c7] text-white border-none"
                              >
                                Get Started
                              </Button>
                            </Link>
                            <Link to="/features">
                              <Button
                                variant="outline"
                                size="lg"
                                className="text-white border-white hover:bg-white/20 hover:text-white"
                              >
                                Learn More
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-none text-white" />
                <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-none text-white" />
              </Carousel>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CareNexa?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare management tools designed for modern
              families and caregivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="p-6 border rounded-xl space-y-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : (
              <>
                <FeatureCard
                  icon={<Shield className="w-8 h-8 text-[#00b4d8]" />}
                  title="Verified Helpers"
                  description="Every helper on our platform undergoes rigorous background checks and verification processes."
                />
                <FeatureCard
                  icon={<Activity className="w-8 h-8 text-[#00b4d8]" />}
                  title="Health Tracking"
                  description="Monitor vital signs, medication schedules, and health progress in real-time dashboards."
                />
                <FeatureCard
                  icon={<Heart className="w-8 h-8 text-[#00b4d8]" />}
                  title="Compassionate Care"
                  description="Our community is built on empathy, respect, and a genuine desire to help others."
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know about CareNexa services.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              className="w-full bg-white rounded-xl shadow-sm border px-6"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I book a helper?</AccordionTrigger>
                <AccordionContent>
                  Booking a helper is easy! Simply sign up as a patient, browse
                  our list of verified helpers, view their profiles and ratings,
                  and click "Book Now" to schedule a visit.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is my health data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, absolutely. We use industry-standard encryption and
                  security measures to protect your personal health information.
                  Your privacy is our top priority.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I register as a helper?</AccordionTrigger>
                <AccordionContent>
                  Yes! If you have experience in caregiving or simply want to
                  help, you can register as a helper. You'll need to undergo our
                  verification process before accepting bookings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What regions do you serve?</AccordionTrigger>
                <AccordionContent>
                  We are currently expanding across major cities. You can check
                  availability by entering your zip code during the registration
                  process.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#00b4d8]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Better Care?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied users who have found peace of mind with
            CareNexa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-[#00b4d8] hover:bg-gray-100 h-12 px-8"
              >
                Sign Up Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 h-12 px-8"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default Home;
