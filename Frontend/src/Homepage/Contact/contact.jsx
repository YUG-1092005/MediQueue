import React, { useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';
import "./contact.css"
import axios from 'axios';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post(`${import.meta.env.VITE_CONTACT_SERVER_URL}/api/contact`, formData);
      setStatus("Thank you! Your message has been sent.");
      setFormData({ name: '', email: '', organization: '', message: '' });
    } catch (error) {
      setStatus("Sorry, there was an error sending your message.");
    }
  };
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Healthcare Facility?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team to learn how our platform can optimize your operations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <ContactInfo icon={<MdEmail size={24} className="text-blue-600" />} title="Email" text="mediqueue24@gmail.com" />
              <ContactInfo icon={<MdPhone size={24} className="text-green-600" />} title="Phone" text="+91 9313877075" />
              <ContactInfo icon={<MdLocationOn size={24} className="text-purple-600" />} title="WhatsApp" text="+91 9313877075" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form bg-gray-50 p-8 rounded-2xl shadow-md">
            <div className="space-y-6">
              <FormInput label="Your Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" />
              <FormInput label="Enter Your Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
              <FormInput label="Enter Your Organization Name" name="organization" value={formData.organization} onChange={handleChange} placeholder="Enter your organization name" />
              <FormTextarea label="Enter Message" name="message" value={formData.message} onChange={handleChange} required placeholder="Enter your message" />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <MdSend size={20} />
                Send Message
              </button>
              {status && <div className="mt-4 text-center text-sm text-blue-700">{status}</div>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ icon, title, text }) => (
  <div className="flex items-center">
    <div className="bg-gray-100 rounded-lg p-3 mr-4 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-600">{text}</p>
    </div>
  </div>
);

const FormInput = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    />
  </div>
);

const FormTextarea = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      rows={4}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    />
  </div>
);
