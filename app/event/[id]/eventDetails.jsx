'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const placeholderImage = '/api/placeholder/600/400';

export default function EventDetails({ id }) {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showForums, setShowForums] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('user')));

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/api/event/${id}`);
        const eventData = response.data;
        setEvent(eventData);

        const commentsResponse = await axios.get(`/api/event/${id}/comments`);
        setComments(commentsResponse.data);

        const eventDate = new Date(eventData.date);
        const now = new Date();
        setShowForums(now >= eventDate);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(`/api/event/${id}/comments`, {
        content: newComment,
        userId: currentUser.id,
      });

      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-white text-center py-8">Event not found</div>;
  }

  return (
    <div className="text-white px-4 py-8 md:px-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <div className="relative h-[60vh] rounded-2xl overflow-hidden mb-8">
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${event.image})`,
              filter: 'blur(10px)',
              transform: 'scale(1.1)',
            }}
          />
          
          {/* Center image */}
          <div className="absolute top-0 inset-0 flex items-center justify-center z-10 rounded-sm mb-4">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-auto object-contain rounded-lg shadow-lg p-6 mb-8"
              onError={(e) => (e.target.src = placeholderImage)}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131324] via-[#13132455] to-transparent z-20" />
          
          {/* Bottom text */}
          <div className="absolute bottom-0 p-8 z-30 mt-6">
            <h1 className="text-2xl md:text-3xl mb-4">{event.title}</h1>
            <p className="md:text-lg text-gray-200">{event.description}</p>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className={`grid gap-8 mb-12 ${
          event.isPaid ? 'md:grid-cols-2' : 'grid-cols-1'
        }`}>
          <motion.div
            initial={{ x: event.isPaid ? -20 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1e1e36] p-6 rounded-xl"
          >
            <h2 className="text-2xl mb-4">Event Information</h2>
            <div className="space-y-4">
              <p><span className="text-gray-400">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
              <p><span className="text-gray-400">Time:</span> {new Date(event.date).toLocaleTimeString()}</p>
              <p><span className="text-gray-400">Location:</span> {event.location}</p>
              <p><span className="text-gray-400">Price:</span> {event.isPaid ? `Ksh. ${event.ticketPrice}` : 'Free'}</p>
            </div>
          </motion.div>

          {event.isPaid && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1e1e36] p-6 rounded-xl"
            >
              <h2 className="text-2xl mb-4">Registration</h2>
              {currentUser ? (
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors"
                  onClick={() => {/* Add registration logic */}}
                >
                  Register for Event
                </button>
              ) : (
                <p className="text-gray-400">Please login to register for this event.</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Forums Section */}
        <AnimatePresence>
          {showForums && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="bg-[#1e1e36] p-6 rounded-xl">
                <h2 className="text-2xl mb-4">Event Forums</h2>
                <p className="text-gray-400">Join the discussion with other attendees!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1e1e36] p-6 rounded-xl"
        >
          <h2 className="text-2xl mb-4">Comments</h2>
          <div className="space-y-4 mb-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-[#131324] p-4 rounded-lg">
                  <p className="text-gray-200">{comment.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {currentUser ? (
            <div className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-[#131324] text-white p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Add a comment..."
                rows={4}
              />
              <button
                onClick={handleAddComment}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Post Comment
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Please login to comment.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
