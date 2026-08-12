import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock successful submission
    toast.success('Thanks for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6">Get in <span className="text-primary">Touch</span></h1>
        <p className="text-xl text-textSecondary max-w-2xl mx-auto leading-relaxed">
          Have a question about our products, an existing order, or just want to talk about audio? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-surface p-8 md:p-10 rounded-3xl border border-border shadow-soft h-full">
            <h2 className="text-2xl font-bold text-textPrimary mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-primary/20 group-hover:bg-primary/30 transition-colors rounded-2xl flex flex-shrink-0 items-center justify-center text-primary text-2xl mt-1">
                  <FiMapPin />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-textPrimary mb-1">Our Headquarters</h3>
                  <p className="text-textSecondary text-base leading-relaxed">123 Audio Lane, Tech District<br />San Francisco, CA 94105</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-primary/20 group-hover:bg-primary/30 transition-colors rounded-2xl flex flex-shrink-0 items-center justify-center text-primary text-2xl mt-1">
                  <FiPhone />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-textPrimary mb-1">Phone Number</h3>
                  <p className="text-textSecondary text-base leading-relaxed">+1 (555) 123-4567<br />Mon-Fri 9am-6pm PST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-primary/20 group-hover:bg-primary/30 transition-colors rounded-2xl flex flex-shrink-0 items-center justify-center text-primary text-2xl mt-1">
                  <FiMail />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-textPrimary mb-1">Email Address</h3>
                  <p className="text-textSecondary text-base leading-relaxed">support@audiohub.com<br />sales@audiohub.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface p-8 md:p-10 rounded-3xl border border-border shadow-soft">
          <h2 className="text-2xl font-bold text-textPrimary mb-8">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2 ml-1">Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2 ml-1">Your Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2 ml-1">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="How can we help?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2 ml-1">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            
            <Button type="submit" className="w-full py-4 text-base font-bold flex items-center justify-center gap-2">
              <FiSend className="text-lg" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
