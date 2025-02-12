'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email,
      })

      if (!response.data.status) {
        toast.error('Failed to send password reset link. Please try again.')
        return
      }

      toast.success('Password reset link sent to your email!')
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <form className="p-6" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 text-gray-200 placeholder-gray-400 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
      />
      <div className="flex items-center justify-center mx-auto mt-4 text-center">
        <button
          type="submit"
          className="w-auto px-6 py-2 mt-2 font-medium leading-normal text-indigo-600 transition duration-150 ease-in-out bg-transparent border-2 border-indigo-600 rounded-full hover:bg-opacity-10 hover:bg-gray-300"
        >
          Send Reset Link
        </button>
      </div>
      <span className="block mt-6 text-sm text-center text-gray-300">
        Remembered your password?{' '}
        <Link href="/login" className="font-bold text-indigo-500 hover:text-indigo-600">
          Login
        </Link>
      </span>
    </form>
  )
}
