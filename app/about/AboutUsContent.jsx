'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Head from 'next/head';

const AboutUsContent = () => {
  const [activeElement, setActiveElement] = useState('');

  const handleClick = (value) => {
    setActiveElement(value === activeElement ? '' : value);
  };

  const faqs = [
    {
      id: 'element1',
      question: 'What is EventKick?',
      answer:
        'EventKick is a platform designed to help you discover and plan events effortlessly. Whether you\'re hosting a small meetup or a large conference, EventKick provides the tools you need to make your event a success.',
    },
    {
      id: 'element2',
      question: 'How do I create an event?',
      answer: (
        <>
          To create an event, simply sign in to your account, navigate to the{' '}
          <Link href="/plan" className="text-white font-medium underline">
            Plan
          </Link>{' '}
          page, and fill out the event submission form. Make sure to include all the necessary details such as the event title, description, date, location, and an image. Once submitted, your event will be reviewed and approved by our team.
        </>
      ),
    },
    {
      id: 'element3',
      question: 'How do I access my tickets?',
      answer: (
        <>
          After registering for an event, you can find your tickets in the{' '}
          <Link href="/profile" className="text-white font-medium underline">
            Profile
          </Link>{' '}
          section. Head to the 'My Tickets' section to view and manage your event tickets.
        </>
      ),
    },
    {
      id: 'element4',
      question: 'How can I participate in forums?',
      answer: (
        <>
          Our forums allow users to engage in discussions related to specific events. To participate, navigate to the{' '}
          <Link href="/events" className="text-white font-medium underline">
            Events
          </Link>{' '}
          section, find the event you're interested in, register and join the conversation. Alternatively, you can find the event link under 'My Tickets' in your{' '}
          <Link href="/profile" className="text-white font-medium underline">
            Profile
          </Link>{' '}
          page for your registered event's forum.
        </>
      ),
    },
    {
      id: 'element5',
      question: 'How do payments work?',
      answer: (
        <>
          EventKick ensures secure and seamless payments for event registrations. All transactions are encrypted and processed through trusted payment gateways. You can always find your payment history in the{' '}
          <Link href="/profile" className="text-white font-medium underline">
            Profile
          </Link>{' '}
          section.
        </>
      ),
    },
  ];

  return (
    <>
      <div className="bg-[#131324] text-white min-h-screen">
        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-8">
            <h1 className="text-2xl text-center font-semibold mb-4">About EventKick</h1>
            <p className=" text-gray-300">
              EventKick is your go-to platform for discovering, planning and experiencing amazing events. Our mission is to make event planning and discovery seamless and enjoyable for everyone.
            </p>
          </section>

          {/* Features Section */}
          <section className="mb-8">
            <h2 className="text-xl text-center font-medium mb-4">Key Features</h2>
            <p className="text-gray-300 mb-4">
              Discover and plan events effortlessly with EventKick. Our platform offers comprehensive tools for event planners and attendees, including:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {["Discover events based on your interests", "Plan and manage events with ease", "Manage tickets on your profile", "Secure and seamless payment options", "Forums for user engagement", "Ratings and reviews of events"].map((feature, index) => (
                <div key={index} className="bg-[#1e1e36] p-3 rounded flex items-center">
                  <div className="h-2 w-2 bg-[#ACF7C1] rounded-full mr-2" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-8">
            <h2 className="text-xl text-center font-medium mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-[#1e1e36] rounded overflow-hidden">
                  <button
                    className="w-full px-4 py-3 text-left flex items-center justify-between "
                    onClick={() => handleClick(faq.id)}
                  >
                    <span
                      className={`text-[#ACF7C1] font-medium ${
                        activeElement === faq.id ? 'text-[#CE4257]' : ''
                      }`}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        activeElement === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      activeElement === faq.id ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-4 py-3 text-sm text-[#E2C2C6]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AboutUsContent;
