'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Plus } from 'lucide-react';
import axios from 'axios';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const EventCard = ({ event, isFeatured = false }) => (
  <Link 
    href={`/event/${event._id}`}
    className="block group bg-[#131324] rounded-lg overflow-hidden mx-3 transition-transform hover:scale-105"
  >
    <div className="relative aspect-video">
      <img 
        src={event.image} 
        alt={event.title}
        className="w-full h-full object-cover"
      />
      {event.isPaid && (
        <span className="absolute top-2 right-2 bg-[#1e1e36] text-white text-xs px-2 py-1 rounded">
          Paid Event
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-white  font-semibold mb-2">{event.title}</h3>
      <div className="flex items-center text-gray-300 text-xs mb-2">
        <Calendar size={12} className="mr-1" />
        <span>{formatDate(event.date)}</span>
      </div>
      <div className="flex items-center text-gray-300 text-xs">
        <MapPin size={12} className="mr-1" />
        <span>{event.location}</span>
      </div>
    </div>
  </Link>
);

const EventModal = ({ event, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-[#1e1e36] rounded-lg max-w-2xl w-full">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-white text-lg font-semibold">{event.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <img src={event.image} alt={event.title} className="w-full rounded-lg mb-4" />
        <div className="space-y-3">
          <p className="text-gray-300 ">{event.description}</p>
          <div className="flex items-center text-gray-300 ">
            <Clock size={16} className="mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-300 ">
            <MapPin size={16} className="mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EventsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [events, setEvents] = useState([]);
  
  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/event/')
      console.log(res.data)
      setEvents(res.data)
    } catch (e) {
      console.error('Error: ', e)
    }
  }
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const featuredEvents = events.filter(event => event.isFeatured);
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const moreEvents = events.filter(event => !event.isFeatured);
  
  const displayedMoreEvents = showMore ? moreEvents : moreEvents.slice(0, 20);

  return (
    <div className="min-h-screen bg-[#131324] py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-white text-2xl font-bold mb-4">Your One-Stop Events Destination</h1>
        <p className="text-gray-300  mb-6">Discover amazing events happening around you</p>
        <Link 
          href="/plan" 
          className="inline-flex items-center bg-[#1e1e36] text-white  px-4 py-2 rounded-lg hover:bg-opacity-80"
        >
          <Plus size={16} className="mr-2" />
          Post Your Event
        </Link>
      </div>

      {/* Featured Events Section */}
      <section className="mb-12">
        <h2 className="text-white text-lg font-semibold mb-6">Featured Events</h2>
        <p className="text-white mb-6">Dive into the hottest events everyone is buzzing about. Don&apos;t miss out on the action!</p>
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {upcomingEvents.map(event => (
                <div key={event._id} className="w-full md:w-1/3 flex-shrink-0 px-4">
                  <EventCard event={event}  />
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setCurrentSlide(curr => Math.max(0, curr - 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1e1e36] p-2 rounded-full cursor-pointer"
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button 
            onClick={() => setCurrentSlide(curr => Math.min(featuredEvents.length - 1, curr + 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1e1e36] p-2 rounded-full"
            disabled={currentSlide === featuredEvents.length - 1}
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="mb-12">
        <h2 className="text-white text-lg font-semibold mb-6">Upcoming Events</h2>
        <p className="text-white mb-6">Get ready for exciting events coming your way. Mark your calendar and be part of something amazing.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-7 gap-6">
          {upcomingEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>

      {/* More Events Section */}
      <section>
        <h2 className="text-white text-lg font-semibold mb-6">More Events</h2>
        <p className="text-white mb-6">From music festivals and house parties to tech meetups, there&apos;s something for everyone. Find your perfect event below.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMoreEvents.map(event => (
            <div 
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer bg-[#1e1e36] rounded-lg overflow-hidden hover:opacity-90"
            >
              <div className="p-4">
                <h3 className="text-white  font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-300 text-xs">{event.category}</p>
                <p className="text-gray-300 text-xs">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
        {moreEvents.length > 20 && !showMore && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowMore(true)}
              className="bg-[#1e1e36] text-white  px-6 py-2 rounded-lg hover:bg-opacity-80"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
};

export default EventsPage;