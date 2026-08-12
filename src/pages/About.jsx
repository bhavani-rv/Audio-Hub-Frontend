import React from 'react';
import { FiHeadphones, FiAward, FiTruck, FiUsers } from 'react-icons/fi';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6">
          About <span className="text-primary">Audio Hub</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto leading-relaxed">
          We are passionate about delivering the ultimate sound experience. Whether you're a professional audiophile, a competitive gamer, or just love great music, we have the perfect gear for you.
        </p>
      </div>

      {/* Story Section */}
      <div className="bg-surface rounded-3xl p-8 md:p-12 border border-border shadow-soft mb-16 flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2 w-full">
          <div className="aspect-video rounded-2xl flex items-center justify-center border border-border overflow-hidden relative group shadow-inner bg-background">
            <img 
              src="/about-hero.png" 
              alt="Premium Headphones on Desk" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none mix-blend-overlay" />
          </div>
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-textPrimary flex items-center gap-3">
            Our Story
          </h2>
          <p className="text-textSecondary text-lg leading-relaxed">
            Founded in 2023, Audio Hub started with a simple mission: to make premium audio equipment accessible to everyone. We noticed a gap in the market for a dedicated platform that truly understands the nuances of sound quality and user comfort.
          </p>
          <p className="text-textSecondary text-lg leading-relaxed">
            Today, we partner with top-tier brands and curate a selection of headphones, earbuds, and studio gear that meets our strict standards for excellence. Every product we sell is one we would proudly use ourselves.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface rounded-2xl p-8 border border-border text-center hover:-translate-y-2 transition-all duration-300 shadow-soft hover:shadow-glow hover:border-primary/30">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary text-4xl rotate-3 hover:rotate-0 transition-transform">
            <FiAward />
          </div>
          <h3 className="text-xl font-bold text-textPrimary mb-3">Premium Quality</h3>
          <p className="text-textSecondary leading-relaxed">We only stock verified, authentic products from trusted audio brands worldwide.</p>
        </div>
        <div className="bg-surface rounded-2xl p-8 border border-border text-center hover:-translate-y-2 transition-all duration-300 shadow-soft hover:shadow-glow hover:border-primary/30">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary text-4xl -rotate-3 hover:rotate-0 transition-transform">
            <FiTruck />
          </div>
          <h3 className="text-xl font-bold text-textPrimary mb-3">Fast & Secure Shipping</h3>
          <p className="text-textSecondary leading-relaxed">Your premium gear is packaged with care and delivered swiftly to your doorstep.</p>
        </div>
        <div className="bg-surface rounded-2xl p-8 border border-border text-center hover:-translate-y-2 transition-all duration-300 shadow-soft hover:shadow-glow hover:border-primary/30">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary text-4xl rotate-3 hover:rotate-0 transition-transform">
            <FiUsers />
          </div>
          <h3 className="text-xl font-bold text-textPrimary mb-3">Expert Support</h3>
          <p className="text-textSecondary leading-relaxed">Our team of audio experts is always ready to help you find your perfect sound.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
