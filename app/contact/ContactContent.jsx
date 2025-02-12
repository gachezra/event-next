'use client';

import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import axios from 'axios';
import { sendMessageRoute } from '../../utils/APIRoutes';

const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [notification, setNotification] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(sendMessageRoute, formData);
      setNotification({ type: 'success', message: res.data.msg });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.msg || 'An error occurred while sending the message.' 
      });
    }
  };

  return (
    <div className="flex flex-col bg-[#131324] text-white">
      <main className="container mx-auto flex-grow p-4">
        <section className="my-8 text-center">
          <h1 className="text-3xl font-semibold mb-3">Get in Touch</h1>
          <p className=" mb-4">
            We'd love to hear from you! Whether you have questions about our events, how to post your event, feedback, or just want to say hello, feel free to reach out to us.
          </p>
        </section>
        <h1 className="text-2xl font-semibold mb-3">Contact Us</h1>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <form onSubmit={handleSubmit} className="bg-[#1e1e36] p-4 rounded-md shadow-md md:w-1/2">
            {notification.message && (
              <div
                className={`mb-3 p-2 rounded  ${
                  notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {notification.message}
              </div>
            )}
            {['name', 'email', 'subject', 'message'].map((field) => (
              <div key={field} className="mb-3">
                <label htmlFor={field} className="block text-xs font-medium mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 bg-transparent border-b border-gray-300  focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>
            ))}
            <div className="text-center">
              <button
                type="submit"
                className="rounded-full border-2 border-indigo-600 px-4 pb-[4px] pt-1 mt-2 font-medium  text-indigo-600 transition duration-150 hover:border-indigo-500 hover:bg-indigo-100 hover:text-indigo-500 focus:outline-none"
              >
                Submit
              </button>
            </div>
          </form>
          <div className="flex flex-col md:w-1/2 mt-4 md:mt-0">
            <h2 className="text-xl font-semibold mb-3">Follow Us</h2>
            <div className="flex space-x-3">
              <a href="https://facebook.com" className="text-xl text-blue-600">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" className="text-xl text-blue-400">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="text-xl text-pink-600">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" className="text-xl text-blue-700">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactContent;
