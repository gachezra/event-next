'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoMdCloseCircle } from "react-icons/io";
import { TbReceipt2 } from "react-icons/tb";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import EditProfileForm from './EditProfileForm';
import EventList from './EventList';
import SearchBar from './SearchBar';
import TransactionDetailsOverlay from './TransactionDetailsOverlay';
import Ticket from './Ticket';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [editUser, setEditUser] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const avatarSet = localStorage.getItem('isAvatarImageSet');

        console.log(currentUser)
        
        if (!currentUser) {
          toast.error("Please log in to view your profile");
          router.push('/login');
          return;
        }

        if (!avatarSet) {
          router.push("/setAvatar");
          return;
        }

        await Promise.all([
          fetchUserDetails(currentUser._id),
          fetchUserEvents(currentUser._id),
          fetchUserRegisteredEvents(currentUser._id)
        ]);
      } catch (error) {
        console.log(error)
        toast.error("Failed to load profile data");
      }
    };

    initializeProfile();
  }, [router]);

  const fetchUserDetails = async (userId) => {
    const res = await axios.get(`/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setUser(res.data.user);
  };

  const fetchUserEvents = async (userId) => {
    try {
      const { data } = await axios.get(`/api/events/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEvents(data);
    } catch (error) {
      toast.error("Failed to fetch your events");
    }
  };

  const fetchUserRegisteredEvents = async (userId) => {
    try {
      const { data } = await axios.get('/api/events/approved', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const filteredEvents = data.filter(event =>
        event.registeredUsers?.some(registeredUser => 
          registeredUser.user?.toString() === userId
        )
      );
      
      setRegisteredEvents(filteredEvents);
    } catch (error) {
      toast.error("Failed to fetch registered events");
    }
  };

  const handleSave = async (username, email) => {
    try {
      await axios.put(
        `/api/user/${user._id}`,
        { username, email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setEditUser(true);
      await fetchUserDetails(user._id);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleEditEvent = (eventId) => {
    router.push(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/events/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = registeredEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 relative"
      >
        <div className="flex flex-col items-center">
          <div className="absolute top-4 right-4 flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditUser(!editUser)}
              className="p-2 rounded-full hover:bg-gray-700/50"
            >
              {editUser ? <HiOutlinePencilAlt className="w-6 h-6" /> : <IoMdCloseCircle className="w-6 h-6" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTransactionDetails(true)}
              className="p-2 rounded-full hover:bg-gray-700/50"
            >
              <TbReceipt2 className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="relative">
            <img
              src={`data:image/svg+xml;base64,${user.avatarImage}`}
              alt="Avatar"
              className="w-32 h-32 rounded-full ring-4 ring-indigo-500/50 shadow-xl"
            />
            {!editUser && (
              <Link 
                href="/setAvatar"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                  bg-indigo-500 text-white px-3 py-1 rounded-full text-sm
                  hover:bg-indigo-600 transition-colors"
              >
                Edit Avatar
              </Link>
            )}
          </div>

          <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {!editUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <EditProfileForm user={user} onSave={handleSave} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6">My Tickets</h2>
        <SearchBar onSearch={setSearchTerm} placeholder="Search tickets..." />
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredEvents.map(event => (
              <Ticket key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No registered events yet.</p>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6">My Events</h2>
        {events.length > 0 ? (
          <EventList
            events={events}
            isProfilePage={true}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        ) : (
          <p className="text-center text-gray-400 py-8">
            No events posted yet. Create your first event!
          </p>
        )}
      </motion.div>

      <AnimatePresence>
        {showTransactionDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm p-6 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 rounded-xl shadow-xl max-w-2xl w-full"
            >
              <TransactionDetailsOverlay 
                userId={user._id} 
                onClose={() => setShowTransactionDetails(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;