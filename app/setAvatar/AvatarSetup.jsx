'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Buffer } from "buffer";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";

const AvatarSetup = () => {
  const api = `https://api.multiavatar.com/45678945`;
  const router = useRouter();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      router.push("/login");
    }
  }, [router]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar");
    } else {
      toast.promise(
        async () => {
          const user = await JSON.parse(
            localStorage.getItem('user')
          );
          const token = localStorage.getItem("token");

          const { data } = await axios.post(
            `/api/avatar/${user._id}`,
            {
              image: avatars[selectedAvatar],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (data.isSet) {
            user.avatarImage = data.image;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAvatarImageSet', 'true');
            router.push("/profile");
          } else {
            throw new Error("Failed to set avatar");
          }
        },
        {
          loading: 'Setting your avatar...',
          success: 'Avatar set successfully!',
          error: 'Failed to set avatar. Please try again.',
        }
      );
    }
  };

  useEffect(() => {
    const data = [];
    async function fetchData() {
      try {
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = new Buffer(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
      } catch (error) {
        toast.error("Failed to load avatars. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [api]);

  return (
    <div className="flex justify-center items-center flex-col gap-8 md:gap-12 bg-gradient-to-b from-[#131324] to-[#1D1D35] min-h-screen w-full p-4 md:p-8">
      {isLoading ? (
        <div className="w-full max-w-md flex justify-center text-white">
          <p>Patience</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 md:gap-12 w-full max-w-4xl"
        >
          <div className="text-center">
            <h1 className="text-white text-2xl md:text-4xl font-bold mb-2">
              Choose Your Avatar
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Select a profile picture that represents you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {avatars.map((avatar, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative group cursor-pointer
                  ${selectedAvatar === index ? 'ring-4 ring-offset-4 ring-offset-[#131324] ring-[#4e0eff]' : ''}
                  rounded-full p-2 bg-[#1D1D35] hover:bg-[#252542] transition-all duration-300`}
                onClick={() => setSelectedAvatar(index)}
              >
                <div className="relative">
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    className="w-full h-auto transition-all duration-300"
                  />
                  {selectedAvatar === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#4e0eff] bg-opacity-20 rounded-full"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 font-bold text-sm md:text-base uppercase cursor-pointer 
              bg-[#4e0eff] hover:bg-[#5c23ff] text-white rounded-full 
              transition-all duration-300 shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-[#4e0eff] focus:ring-offset-2 focus:ring-offset-[#131324]"
            onClick={setProfilePicture}
            disabled={selectedAvatar === undefined}
          >
            Set as Profile Picture
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AvatarSetup;