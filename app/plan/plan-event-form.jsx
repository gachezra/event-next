'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PlanEventForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const user = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY))
    if (!user) {
      router.push('/login')
      return
    }

    const userId = user._id
    try {
      let imageUrl = null
      if (image) {
        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'events')

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dykwdjdaf/image/upload',
          formData
        )
        imageUrl = response.data.secure_url
      }

      const eventData = {
        title,
        description,
        date: `${date}T${time}`,
        location,
        user: userId,
        image: imageUrl,
      }

      await axios.post('/api/event/post', eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      toast.success('Event created successfully!')
      setTitle('')
      setDescription('')
      setDate('')
      setTime('')
      setLocation('')
      setImage(null)
      setImagePreview(null)
    } catch (error) {
      toast.error('Failed to create event. Please try again.')
      console.error('Error creating event:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1e1e36] p-6 rounded-md shadow-md">
      {/* Title Input */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-600"
          required
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-600"
          required
        />
      </div>

      {/* Date and Time Inputs */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <div className="md:w-1/2">
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-600"
            required
          />
        </div>
        <div className="md:w-1/2">
          <label htmlFor="time" className="block text-sm font-medium mb-2">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-600"
            required
          />
        </div>
      </div>

      {/* Location Input */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-600"
          required
        />
      </div>

      {/* Image Input */}
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium mb-2">
          Event Poster
        </label>
        <div className="relative group w-full h-32 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md bg-[#2c2c3e] cursor-pointer hover:border-indigo-600">
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
          />
          <p className="text-gray-400 group-hover:text-indigo-600 text-center">
            Click to upload or drag & drop an image
          </p>
        </div>
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full rounded-md" />}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center mx-auto mt-4 text-center">
        <button
          type="submit"
          className="w-auto px-6 py-2 mt-2 font-medium leading-normal text-indigo-600 transition duration-150 ease-in-out bg-transparent border-2 border-indigo-600 rounded-full hover:bg-opacity-10 hover:bg-gray-300"
        >
          Submit
        </button>
      </div>
    </form>
  )
}
